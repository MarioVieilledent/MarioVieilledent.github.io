import { useState } from "react";
import { LuLayers2 } from "react-icons/lu";
import type { LayerKey, MapType } from "./MapLayer";
import { layers } from "../utils/constants";

interface LayerMenuProps {
  layer: LayerKey;
  setLayer: React.Dispatch<React.SetStateAction<LayerKey>>;
  mapType: MapType;
  setMapType: React.Dispatch<React.SetStateAction<MapType>>;
}

const makePreviewUrl = (url: string): string =>
  url
    .replace("{z}", "4")
    .replace("{x}", "8")
    .replace("{y}", "5")
    .replace("{a-c}", "a");

const LayerMenu = ({
  layer,
  setLayer,
  mapType,
  setMapType,
}: LayerMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition"
      >
        <LuLayers2 className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed top-20 right-4 z-40 w-64 rounded-3xl bg-white flex flex-col gap-4 shadow-xl p-4 transition-all max-h-[calc(100vh-8rem)] overflow-auto ">
          {Object.entries(layers).map(([name, url]) => (
            <div
              key={name}
              className={`flex items-center gap-4 cursor-pointer ${
                name === layer ? "underline" : ""
              }`}
              onClick={() => {
                setLayer(name as LayerKey);
              }}
            >
              <img
                className="w-16 h-16"
                src={makePreviewUrl(url)}
                alt={`Map preview (${name})`}
              />
              <span>{name}</span>
            </div>
          ))}
          <div
            className={`flex items-center gap-4 cursor-pointer ${
              mapType === "mercator" ? "underline" : ""
            }`}
            onClick={() => setMapType("mercator")}
          >
            <span>2D Mercator</span>
          </div>
          <div
            className={`flex items-center gap-4 cursor-pointer ${
              mapType === "globe" ? "underline" : ""
            }`}
            onClick={() => setMapType("globe")}
          >
            <span>3D Globe</span>
          </div>
        </div>
      )}
    </>
  );
};

export default LayerMenu;
