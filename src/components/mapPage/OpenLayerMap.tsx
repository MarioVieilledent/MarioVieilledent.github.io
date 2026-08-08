import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import Overlay from "ol/Overlay";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { fromLonLat, toLonLat } from "ol/proj";
import { sources } from "../../utils/sources";
import UserLocationDot from "./UserLocationDot";

const FLY_DURATION = 500;
const RESET_ROTATION_DURATION = 300;

interface OpenLayerMapProps {
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  layers: string[];
  center: [number, number];
  zoom: number;
  onPositionChange: (center: [number, number], zoom: number) => void;
  userLocation: { lon: number; lat: number } | null;
}

const OpenLayerMap = forwardRef<
  {
    triggerReset: () => void;
    triggerFlyTo: (lon: number, lat: number, zoom?: number) => void;
  },
  OpenLayerMapProps
>(({ setRotation, layers, center, zoom, onPositionChange, userLocation }, ref) => {
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

      if (map.current === null) {
        map.current = new Map({
          controls: [],
          target: container.current,
          layers: tileLayers,
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
        map.current.setLayers(tileLayers);
      }
    }
  }, [layers]);

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
