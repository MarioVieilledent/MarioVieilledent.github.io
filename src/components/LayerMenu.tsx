import { useState } from "react";
import { LuLayers2 } from "react-icons/lu";
import type { MapType } from "./MapLayer";
import { sources, type Source } from "../utils/constants";

interface LayerMenuProps {
  layer: string;
  setLayer: React.Dispatch<React.SetStateAction<string>>;
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
        <div className="fixed top-20 right-4 z-40 w-[calc(100%-2rem)] rounded-3xl bg-white flex gap-4 shadow-xl p-4 transition-all max-h-[calc(100vh-8rem)] overflow-auto ">
          <div className="flex flex-col gap-4">
            <h2>Base Map</h2>
            <div className="flex gap-4">
              <div className="flex flex-col gap-4">
                <h3>General</h3>
                {sources
                  .filter((l) => l.type === "general")
                  .map((l) => (
                    <LayerButton l={l} layer={layer} setLayer={setLayer} />
                  ))}
              </div>
              <div className="flex flex-col gap-4">
                <h3>Topographic</h3>
                {sources
                  .filter((l) => l.type === "topographic")
                  .map((l) => (
                    <LayerButton l={l} layer={layer} setLayer={setLayer} />
                  ))}
              </div>
              <div className="flex flex-col gap-4">
                <h3>Imagery</h3>
                {sources
                  .filter((l) => l.type === "satellite")
                  .map((l) => (
                    <LayerButton l={l} layer={layer} setLayer={setLayer} />
                  ))}
              </div>
              <div className="flex flex-col gap-4">
                <h3>Other</h3>
                {sources
                  .filter(
                    (l) =>
                      !["general", "topographic", "satellite"].includes(
                        l.type
                      ) && !l.type.startsWith("overlay")
                  )
                  .map((l) => (
                    <LayerButton l={l} layer={layer} setLayer={setLayer} />
                  ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h2>Overlay</h2>
            <div className="flex gap-4">
              <div className="flex flex-col gap-4">
                <h3>Sport</h3>
                {sources
                  .filter((l) => l.type === "overlay-sport")
                  .map((l) => (
                    <LayerButton l={l} layer={layer} setLayer={setLayer} />
                  ))}
              </div>
              <div className="flex flex-col gap-4">
                <h3>Train</h3>
                {sources
                  .filter((l) => l.type === "overlay-train")
                  .map((l) => (
                    <LayerButton l={l} layer={layer} setLayer={setLayer} />
                  ))}
              </div>
              <div className="flex flex-col gap-4">
                <h3>Other</h3>
                {sources
                  .filter((l) => l.type === "overlay")
                  .map((l) => (
                    <LayerButton l={l} layer={layer} setLayer={setLayer} />
                  ))}
              </div>
            </div>
          </div>

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

const LayerButton = ({
  l,
  layer,
  setLayer,
}: {
  l: Source;
  layer: string;
  setLayer: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const isOverlay = l.type.startsWith("overlay");
  const isSelected = l.name === layer;

  return (
    <div
      key={l.name}
      className={`flex items-center gap-4 cursor-pointer ${
        isSelected ? "underline" : ""
      }`}
      onClick={() => {
        if (isOverlay) {
          setLayer(l.name);
        } else {
          setLayer(l.name);
        }
      }}
    >
      {l.url.endsWith("pbf") ? (
        <div className="w-16 h-16">Vector</div>
      ) : (
        <img
          className="w-16 h-16"
          src={makePreviewUrl(l.url)}
          alt={`Map preview (${l.name})`}
        />
      )}
      <span>{l.name}</span>
    </div>
  );
};

export default LayerMenu;
