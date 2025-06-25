import { LuLayers2 } from "react-icons/lu";
import type { MapType } from "./MapLayer";
import { sources } from "../utils/constants";
import LayerButton from "./LayerButton";
import { useTranslation } from "../utils/TranslationContext";
import Float from "./Float";

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
  const { t } = useTranslation();

  return (
    <Float
      Icon={LuLayers2}
      buttonClassName="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition"
      containerClassName="fixed top-20 right-4 z-40 max-w-[calc(100%-2rem)] rounded-3xl bg-white flex gap-4 shadow-xl p-4 transition-all max-h-[calc(100vh-8rem)] overflow-auto"
    >
      <div className="flex flex-col items-start gap-4">
        <h2>{t("baseMap")}</h2>
        <div className="flex flex-col gap-1">
          <h3>{t("general")}</h3>
          {sources
            .filter((l) => l.type === "general")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
              />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h3>{t("topographic")}</h3>
          {sources
            .filter((l) => l.type === "topographic")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
              />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h3>{t("imagery")}</h3>
          {sources
            .filter((l) => l.type === "satellite")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
              />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h3>{t("hybrid")}</h3>
          {sources
            .filter((l) => l.type === "hybrid")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
              />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h3>{t("other")}</h3>
          {sources
            .filter(
              (l) =>
                !["general", "topographic", "satellite", "hybrid"].includes(
                  l.type
                ) && !l.type.startsWith("overlay")
            )
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
              />
            ))}
        </div>
        <div className="flex flex-col gap-4">
          <div
            className={`flex items-center gap-4 cursor-pointer ${
              mapType === "mercator" ? "underline" : ""
            }`}
            onClick={() => setMapType("mercator")}
          >
            <span>{t("2dMercator")}</span>
          </div>
          <div
            className={`flex items-center gap-4 cursor-pointer ${
              mapType === "globe" ? "underline" : ""
            }`}
            onClick={() => setMapType("globe")}
          >
            <span>{t("3dGlobe")}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-4">
          <h2>{t("layers")}</h2>
          {layers.length > 1 && (
            <button
              className="px-4 py-1 bg-sky-200"
              onClick={() => setLayers((prev) => [prev[0]])}
            >
              {`${t("clearLayers")} (${layers.length - 1})`}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3>{t("topographic")}</h3>
          {sources
            .filter((l) => l.type === "overlay-topographic")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
              />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h3>{t("sport")}</h3>
          {sources
            .filter((l) => l.type === "overlay-sport")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
              />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h3>{t("train")}</h3>
          {sources
            .filter((l) => l.type === "overlay-train")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
              />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h3>{t("other")}</h3>
          {sources
            .filter((l) => l.type === "overlay")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
              />
            ))}
        </div>
      </div>
    </Float>
  );
};

export default LayerMenu;
