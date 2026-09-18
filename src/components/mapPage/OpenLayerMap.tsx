import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import Overlay from "ol/Overlay";
import DblClickDragZoom from "ol/interaction/DblClickDragZoom";
import { defaults as defaultInteractions } from "ol/interaction/defaults";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { fromLonLat, toLonLat } from "ol/proj";
import { sources } from "../../utils/sources";
import UserLocationDot from "./UserLocationDot";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature, { type FeatureLike } from "ol/Feature";
import Point from "ol/geom/Point";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import type { MapPoint } from "../../types/types";
import { POINT_LABEL_MIN_ZOOM } from "../../utils/constants";

const FLY_DURATION = 500;
const RESET_ROTATION_DURATION = 300;

const pointStyleCache = new globalThis.Map<string, Style>();

const getPointStyle = (feature: FeatureLike, showLabel: boolean): Style => {
  const color = String(feature.get("color"));
  const name = String(feature.get("name"));
  const cacheKey = `${color}\u0000${showLabel ? name : ""}`;
  const cached = pointStyleCache.get(cacheKey);
  if (cached) return cached;

  const style = new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({ color }),
      stroke: new Stroke({ color: "#ffffff", width: 2 }),
    }),
    text: showLabel
      ? new Text({
          text: name,
          offsetY: -15,
          font: "600 12px sans-serif",
          fill: new Fill({ color: "#1c1917" }),
          stroke: new Stroke({ color: "rgba(255,255,255,0.95)", width: 4 }),
        })
      : undefined,
  });

  pointStyleCache.set(cacheKey, style);
  return style;
};

interface OpenLayerMapProps {
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  layers: string[];
  center: [number, number];
  zoom: number;
  onPositionChange: (center: [number, number], zoom: number) => void;
  userLocation: { lon: number; lat: number } | null;
  points: MapPoint[];
}

const OpenLayerMap = forwardRef<
  {
    triggerReset: () => void;
    triggerFlyTo: (lon: number, lat: number, zoom?: number) => void;
  },
  OpenLayerMapProps
>(({ setRotation, layers, center, zoom, onPositionChange, userLocation, points }, ref) => {
  useImperativeHandle(ref, () => ({
    triggerReset() {
      view.current.animate({
        rotation: 0,
        duration: RESET_ROTATION_DURATION,
      });
    },
    triggerFlyTo(lon: number, lat: number, zoom?: number) {
      const targetZoom = zoom ?? view.current.getZoom();

      const target = fromLonLat([lon, lat]);

      view.current.animate(
        {
          center: target,
          duration: FLY_DURATION,
        },
        {
          zoom: targetZoom,
          duration: FLY_DURATION,
        },
      );
    },
  }));

  const container = useRef(null);
  const map = useRef<Map | null>(null);
  const markerContainer = useRef<HTMLDivElement>(null);
  const marker = useRef<Overlay | null>(null);
  const tileLayers = useRef(new globalThis.Map<string, TileLayer<XYZ>>());
  const pointSource = useRef(new VectorSource());
  const pointLayer = useRef<VectorLayer | null>(null);
  // Only used as the map's starting point — center/zoom is otherwise owned by
  // the parent (MapLayer) so it survives toggling between 2D and 3D.
  const view = useRef<View>(
    new View({
      center: fromLonLat(center),
      zoom,
    }),
  );

  useEffect(() => {
    const handleRotationChange = () => setRotation(view.current.getRotation());
    view.current.on("change:rotation", handleRotationChange);

    return () => {
      view.current.un("change:rotation", handleRotationChange);
    };
  }, [setRotation]);

  useEffect(() => {
    if (!container.current) return;

    pointLayer.current = new VectorLayer({
      source: pointSource.current,
      style: (feature, resolution) => {
        const currentZoom = view.current.getZoomForResolution(resolution);
        const showLabel =
          currentZoom !== undefined && currentZoom >= POINT_LABEL_MIN_ZOOM;
        return getPointStyle(feature, showLabel);
      },
    });

    const instance = new Map({
      controls: [],
      interactions: defaultInteractions().extend([
        new DblClickDragZoom({ delta: -0.01 }),
      ]),
      target: container.current,
      layers: [pointLayer.current],
      view: view.current,
    });
    map.current = instance;

    // Fires once after a pan/zoom/flyTo settles (not on every frame),
    // so this only reports the final resting position.
    const handleMoveEnd = () => {
      const currentZoom = view.current.getZoom();
      if (currentZoom === undefined) return;
      const currentCenter = toLonLat(view.current.getCenter() ?? []) as [
        number,
        number,
      ];
      onPositionChange(currentCenter, currentZoom);
    };
    instance.on("moveend", handleMoveEnd);

    marker.current = new Overlay({
      element: markerContainer.current ?? undefined,
      positioning: "center-center",
      stopEvent: false,
    });
    instance.addOverlay(marker.current);

    return () => {
      instance.un("moveend", handleMoveEnd);
      tileLayers.current.forEach((layer) => layer.dispose());
      tileLayers.current.clear();
      pointSource.current.clear(true);
      pointStyleCache.clear();
      instance.setTarget(undefined);
      instance.dispose();
      map.current = null;
      pointLayer.current = null;
      marker.current = null;
    };
  }, [onPositionChange]);

  useEffect(() => {
    if (!map.current || !pointLayer.current) return;

    const urls = layers
      .map((layerName) => sources.find((source) => source.name === layerName)?.url)
      .filter((url): url is string => url !== undefined);
    const previousLayers = tileLayers.current;
    const nextLayers = new globalThis.Map<string, TileLayer<XYZ>>();
    const activeLayers = urls.map((url, index) => {
      let layer = previousLayers.get(url);
      if (!layer) {
        layer = new TileLayer({
          source: new XYZ({ url }),
        });
      }
      layer.setZIndex(index);
      nextLayers.set(url, layer);
      return layer;
    });

    previousLayers.forEach((layer, url) => {
      if (!nextLayers.has(url)) layer.dispose();
    });
    tileLayers.current = nextLayers;
    pointLayer.current.setZIndex(activeLayers.length);
    map.current.setLayers([...activeLayers, pointLayer.current]);
  }, [layers]);

  useEffect(() => {
    const nextIds = new Set<string>();
    const additions: Feature<Point>[] = [];

    points.forEach((point) => {
      const id = `${point.source}:${point.id}`;
      nextIds.add(id);
      const existing = pointSource.current.getFeatureById(id);
      if (existing) {
        existing.setProperties({ name: point.name, color: point.color }, true);
        return;
      }

      const feature = new Feature({
        geometry: new Point(fromLonLat([point.lon, point.lat])),
        name: point.name,
        color: point.color,
      });
      feature.setId(id);
      additions.push(feature);
    });

    pointSource.current.getFeatures().forEach((feature) => {
      const id = String(feature.getId());
      if (!nextIds.has(id)) pointSource.current.removeFeature(feature);
    });
    if (additions.length > 0) pointSource.current.addFeatures(additions);
    pointStyleCache.clear();
    pointSource.current.changed();
  }, [points]);

  useEffect(() => {
    marker.current?.setPosition(
      userLocation ? fromLonLat([userLocation.lon, userLocation.lat]) : undefined,
    );
  }, [userLocation]);

  return (
    <div className="w-full h-full" id="map" ref={container}>
      <div ref={markerContainer}>
        <UserLocationDot />
      </div>
    </div>
  );
});

export default OpenLayerMap;
