import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { fromLonLat } from "ol/proj";
import {
  LOCAL_STORAGE_CENTER_KEY,
  LOCAL_STORAGE_LAYERS_KEY,
  LOCAL_STORAGE_RESOLUTION_KEY,
} from "../utils/constants";
import { sources } from "../utils/sources";

const DEFAULT_CENTER = [5, 55];
const DEFAULT_ZOOM = 4;

const FLY_DURATION = 500;
const RESET_ROTATION_DURATION = 300;

interface OpenLayerMapProps {
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  layers: string[];
}

const OpenLayerMap = forwardRef<
  {
    triggerReset: () => void;
    triggerFlyTo: (lon: number, lat: number, zoom?: number) => void;
  },
  OpenLayerMapProps
>(({ setRotation, layers }, ref) => {
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
        }
      );
    },
  }));

  const container = useRef(null);
  const map = useRef<Map | null>(null);
  const view = useRef<View>(
    new View({
      center: fromLonLat(DEFAULT_CENTER),
      zoom: DEFAULT_ZOOM,
    })
  );

  useEffect(() => {
    view.current.on("change:center", (event) =>
      window.localStorage.setItem(
        LOCAL_STORAGE_CENTER_KEY,
        event.target.values_.center
      )
    );

    view.current.on("change:resolution", (event) =>
      window.localStorage.setItem(
        LOCAL_STORAGE_RESOLUTION_KEY,
        JSON.stringify(event.target.values_.resolution)
      )
    );

    view.current.on("change:rotation", (event) =>
      setRotation(event.target.values_.rotation)
    );
  }, [setRotation]);

  useEffect(() => {
    window.localStorage.setItem(
      LOCAL_STORAGE_LAYERS_KEY,
      JSON.stringify(layers)
    );

    if (container.current) {
      const baseMapURL: string =
        sources.find((source) => source.name == layers[0])?.url ?? "";

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
          })
      );

      if (map.current === null) {
        map.current = new Map({
          controls: [],
          target: container.current,
          layers: tileLayers,
          view: view.current,
        });
      } else {
        map.current.setLayers(tileLayers);
      }
    }
  }, [layers]);

  return <div className="w-full h-full" id="map" ref={container}></div>;
});

export default OpenLayerMap;
