import { LuLayers2 } from "react-icons/lu";
import LayerButton from "./LayerButton";
import { useTranslation } from "../../utils/TranslationContext";
import Float from "../Float";
import { useIsMobile } from "../../utils/isMobileHook";
import { sources } from "../../utils/sources";
import { FLOATING_BUTTON_BASE } from "../../utils/constants";

interface LayerMenuProps {
  layers: string[];
  setLayers: React.Dispatch<React.SetStateAction<string[]>>;
  globeView: boolean;
}

const sectionTitle = "text-xs font-semibold uppercase tracking-wide text-stone-500";

const LayerMenu = ({ layers, setLayers, globeView }: LayerMenuProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <Float
      Icon={LuLayers2}
      buttonClassName={`fixed top-4 right-4 z-50 ${FLOATING_BUTTON_BASE}`}
      containerClassName={`fixed top-20 right-4 z-40 max-w-[calc(100%-2rem)] rounded-3xl border border-stone-200 bg-white flex items-stretch shadow-xl transition-all max-h-[calc(100vh-8rem)] ${
        isMobile ? "p-3 gap-3" : "p-5 gap-5"
      }`}
    >
      <div className="flex flex-col items-start gap-4 overflow-auto">
        <h2 className="text-lg font-bold text-stone-900">{t("baseMap")}</h2>
        <div className={`flex  gap-5 ${isMobile ? "flex-col" : ""}`}>
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col gap-1">
              <h3 className={sectionTitle}>{t("general")}</h3>
              {sources
                .filter((l) => l.type === "general")
                .map((l) => (
                  <LayerButton
                    key={l.name}
                    l={l}
                    layers={layers}
                    setLayers={setLayers}
                    globeView={globeView}
                  />
                ))}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className={sectionTitle}>{t("topographic")}</h3>
              {sources
                .filter((l) => l.type === "topographic")
                .map((l) => (
                  <LayerButton
                    key={l.name}
                    l={l}
                    layers={layers}
                    setLayers={setLayers}
                    globeView={globeView}
                  />
                ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col gap-1">
              <h3 className={sectionTitle}>{t("imagery")}</h3>
              {sources
                .filter((l) => l.type === "satellite")
                .map((l) => (
                  <LayerButton
                    key={l.name}
                    l={l}
                    layers={layers}
                    setLayers={setLayers}
                    globeView={globeView}
                  />
                ))}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className={sectionTitle}>{t("hybrid")}</h3>
              {sources
                .filter((l) => l.type === "hybrid")
                .map((l) => (
                  <LayerButton
                    key={l.name}
                    l={l}
                    layers={layers}
                    setLayers={setLayers}
                    globeView={globeView}
                  />
                ))}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className={sectionTitle}>{t("sport")}</h3>
              {sources
                .filter((l) => l.type === "outdoor")
                .map((l) => (
                  <LayerButton
                    key={l.name}
                    l={l}
                    layers={layers}
                    setLayers={setLayers}
                    globeView={globeView}
                  />
                ))}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className={sectionTitle}>{t("transport")}</h3>
              {sources
                .filter((l) => l.type === "transport")
                .map((l) => (
                  <LayerButton
                    key={l.name}
                    l={l}
                    layers={layers}
                    setLayers={setLayers}
                    globeView={globeView}
                  />
                ))}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className={sectionTitle}>{t("other")}</h3>
              {sources
                .filter(
                  (l) =>
                    ![
                      "general",
                      "topographic",
                      "satellite",
                      "hybrid",
                      "outdoor",
                      "transport",
                    ].includes(l.type) && !l.type.startsWith("overlay")
                )
                .map((l) => (
                  <LayerButton
                    key={l.name}
                    l={l}
                    layers={layers}
                    setLayers={setLayers}
                    globeView={globeView}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-px shrink-0 bg-stone-200"></div>
      <div className="flex flex-col gap-4 overflow-auto">
        <div
          className={`flex items-center justify-between gap-4 ${
            isMobile ? "flex-col items-start" : ""
          }`}
        >
          <h2 className="text-lg font-bold text-stone-900">{t("layers")}</h2>
          {layers.length > 1 && (
            <button
              className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 transition-colors hover:border-amber-300 hover:text-amber-700"
              onClick={() => setLayers((prev) => [prev[0]])}
            >
              {`${t("clearLayers")} (${layers.length - 1})`}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className={sectionTitle}>{t("topographic")}</h3>
          {sources
            .filter((l) => l.type === "overlay-topographic")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
                globeView={globeView}
              />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className={sectionTitle}>{t("sport")}</h3>
          {sources
            .filter((l) => l.type === "overlay-sport")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
                globeView={globeView}
              />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className={sectionTitle}>{t("train")}</h3>
          {sources
            .filter((l) => l.type === "overlay-train")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
                globeView={globeView}
              />
            ))}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className={sectionTitle}>{t("other")}</h3>
          {sources
            .filter((l) => l.type === "overlay")
            .map((l) => (
              <LayerButton
                key={l.name}
                l={l}
                layers={layers}
                setLayers={setLayers}
                globeView={globeView}
              />
            ))}
        </div>
      </div>
    </Float>
  );
};

export default LayerMenu;
