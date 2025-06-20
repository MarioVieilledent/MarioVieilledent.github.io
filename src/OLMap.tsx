import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import FullScreen from "ol/control/FullScreen.js";
import { defaults as defaultControls } from "ol/control/defaults.js";

import { useEffect, useRef } from "react";
import { fromLonLat } from "ol/proj";

const sources = {
  OpenStreetMap: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  OpenStreetMapAC: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  OpenTopoMap: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
  CartoLight:
    "https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  CartoDark:
    "  https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  ArcGIS:
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  WandereitkartTopo: "https://topo.wanderreitkarte.de/topo/{z}/{x}/{y}.png",
  WandereitkartTradi: "https://tradi2.wanderreitkarte.de/tradi/{z}/{x}/{y}.png",
  Utagawavtt: "https://maps.utagawavtt.com/styles/utagawavtt/{z}/{x}/{y}.png",
  Thunderforest: "https://tile.thunderforest.com/landscape/12/2161/1107.png", // Needs API key
};

const OLMap = () => {
  const ref = useRef(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (ref.current && map.current === null) {
      map.current = new Map({
        controls: defaultControls().extend([new FullScreen()]),
        target: ref.current as HTMLElement,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: sources.OpenTopoMap,
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([5, 55]),
          zoom: 4,
        }),
      });
    }
  });

  return <div className="w-full h-full" id="map" ref={ref}></div>;
};

export default OLMap;
