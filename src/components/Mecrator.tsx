import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { fromLonLat } from "ol/proj";
import {
  knownTileSources,
  LOCAL_STORAGE_CENTER_KEY,
  LOCAL_STORAGE_LAYER_KEY,
  LOCAL_STORAGE_RESOLUTION_KEY,
} from "../utils/constants";
import { type MapType } from "./MapLayer";

const DEFAULT_CENTER = [5, 55];
const DEFAULT_ZOOM = 4;

interface MercatorProps {
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  layer: string;
  mapType: MapType;
}

const Mercator = forwardRef<{ triggerReset: () => void }, MercatorProps>(
  ({ setRotation, layer, mapType }, ref) => {
    useImperativeHandle(ref, () => ({
      triggerReset() {
        view.current.setRotation(0);
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
      window.localStorage.setItem(LOCAL_STORAGE_LAYER_KEY, layer);

      if (container.current && mapType === "mercator") {
        if (map.current === null) {
          map.current = new Map({
            controls: [],
            target: container.current,
            layers: [
              new TileLayer({
                source: new XYZ({
                  url: knownTileSources.find((ly) => ly.name == layer)?.url,
                }),
              }),
            ],
            view: view.current,
          });
        } else {
          map.current.setLayers([
            new TileLayer({
              source: new XYZ({
                url: knownTileSources.find((ly) => ly.name == layer)?.url,
              }),
            }),
          ]);
        }
      }
    }, [layer, mapType]);

    return <div className="w-full h-full" id="map" ref={container}></div>;
  }
);

export default Mercator;
