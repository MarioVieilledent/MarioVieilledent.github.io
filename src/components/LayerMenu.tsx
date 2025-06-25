import { useState } from "react";
import { LuLayers2 } from "react-icons/lu";
import type { MapType } from "./MapLayer";
import { sources } from "../utils/constants";
import LayerButton from "./LayerButton";

interface LayerMenuProps {
  layers: string[];
  setLayers: React.Dispatch<React.SetStateAction<string[]>>;
  mapType: MapType;
  setMapType: React.Dispatch<React.SetStateAction<MapType>>;
}

const LayerMenu = ({
  layers,
  setLayers,
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
        <div className="fixed top-20 right-4 z-40 max-w-[calc(100%-2rem)] rounded-3xl bg-white flex gap-4 shadow-xl p-4 transition-all max-h-[calc(100vh-8rem)] overflow-auto ">
          <div className="flex flex-col items-start gap-4">
            <h2>Base Map</h2>
            <div className="flex flex-col gap-1">
              <h3>General</h3>
              {sources
                .filter((l) => l.type === "general")
                .map((l) => (
                  <LayerButton l={l} layers={layers} setLayers={setLayers} />
                ))}
            </div>
            <div className="flex flex-col gap-1">
              <h3>Topographic</h3>
              {sources
                .filter((l) => l.type === "topographic")
                .map((l) => (
                  <LayerButton l={l} layers={layers} setLayers={setLayers} />
                ))}
            </div>
            <div className="flex flex-col gap-1">
              <h3>Imagery</h3>
              {sources
                .filter((l) => l.type === "satellite")
                .map((l) => (
                  <LayerButton l={l} layers={layers} setLayers={setLayers} />
                ))}
            </div>
            <div className="flex flex-col gap-1">
              <h3>Other</h3>
              {sources
                .filter(
                  (l) =>
                    !["general", "topographic", "satellite"].includes(l.type) &&
                    !l.type.startsWith("overlay")
                )
                .map((l) => (
                  <LayerButton l={l} layers={layers} setLayers={setLayers} />
                ))}
            </div>
            <div className="flex flex-col gap-4">
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
          </div>
          <div className="flex flex-col items-start gap-4">
            <h2>Overlays</h2>
            <button
              className="px-4 py-1 bg-sky-200"
              onClick={() => setLayers((prev) => [prev[0]])}
            >
              Clear overlays ({layers.length - 1})
            </button>
            <div className="flex flex-col gap-1">
              <h3>Sport</h3>
              {sources
                .filter((l) => l.type === "overlay-sport")
                .map((l) => (
                  <LayerButton l={l} layers={layers} setLayers={setLayers} />
                ))}
            </div>
            <div className="flex flex-col gap-1">
              <h3>Train</h3>
              {sources
                .filter((l) => l.type === "overlay-train")
                .map((l) => (
                  <LayerButton l={l} layers={layers} setLayers={setLayers} />
                ))}
            </div>
            <div className="flex flex-col gap-1">
              <h3>Other</h3>
              {sources
                .filter((l) => l.type === "overlay")
                .map((l) => (
                  <LayerButton l={l} layers={layers} setLayers={setLayers} />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LayerMenu;
