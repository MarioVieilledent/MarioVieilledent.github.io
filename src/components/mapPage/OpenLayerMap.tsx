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
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import type { MapPoint } from "../../types/types";
import { POINT_LABEL_MIN_ZOOM } from "../../utils/constants";

const FLY_DURATION = 500;
const RESET_ROTATION_DURATION = 300;

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
  // Only used as the map's starting point — center/zoom is otherwise owned by
  // the parent (MapLayer) so it survives toggling between 2D and 3D.
  const view = useRef<View>(
    new View({
      center: fromLonLat(center),
      zoom,
    }),
  );

  useEffect(() => {
    view.current.on("change:rotation", (event) =>
      setRotation(event.target.values_.rotation),
    );
  }, [setRotation]);

  useEffect(() => {
    if (container.current) {
      const baseMapURL: string =
        sources.find((source) => source.name === layers[0])?.url ?? "";

      const overlaysURLs: string[] = sources
        .filter((source) => layers.includes(source.name))
        .map((source) => source.url);

      const tileLayers = [baseMapURL, ...overlaysURLs].map(
        (url, index) =>
          new TileLayer({
            source: new XYZ({
              url,
            }),
            zIndex: index,
          }),
      );
      const pointLayer = new VectorLayer({
        source: new VectorSource({
          features: points.map(
            (point) =>
              new Feature({
                geometry: new Point(fromLonLat([point.lon, point.lat])),
                name: point.name,
                color: point.color,
              }),
          ),
        }),
        style: (feature, resolution) => {
          const currentZoom = view.current.getZoomForResolution(resolution);
          const showLabel =
            currentZoom !== undefined && currentZoom >= POINT_LABEL_MIN_ZOOM;

          return new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: String(feature.get("color")) }),
              stroke: new Stroke({ color: "#ffffff", width: 2 }),
            }),
            text: showLabel
              ? new Text({
                  text: String(feature.get("name")),
                  offsetY: -15,
                  font: "600 12px sans-serif",
                  fill: new Fill({ color: "#1c1917" }),
                  stroke: new Stroke({ color: "rgba(255,255,255,0.95)", width: 4 }),
                })
              : undefined,
          });
        },
        zIndex: tileLayers.length,
      });
      const mapLayers = [...tileLayers, pointLayer];

      if (map.current === null) {
        map.current = new Map({
          controls: [],
          interactions: defaultInteractions().extend([
            new DblClickDragZoom({ delta: -0.01 }),
          ]),
          target: container.current,
          layers: mapLayers,
          view: view.current,
        });

        // Fires once after a pan/zoom/flyTo settles (not on every frame),
        // so this only reports the final resting position.
        map.current.on("moveend", () => {
          const currentZoom = view.current.getZoom();
          if (currentZoom === undefined) return;
          const currentCenter = toLonLat(view.current.getCenter() ?? []) as [
            number,
            number,
          ];
          onPositionChange(currentCenter, currentZoom);
        });

        marker.current = new Overlay({
          element: markerContainer.current ?? undefined,
          positioning: "center-center",
          stopEvent: false,
        });
        map.current.addOverlay(marker.current);
      } else {
        map.current.setLayers(mapLayers);
      }
    }
  }, [layers, points]);

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
