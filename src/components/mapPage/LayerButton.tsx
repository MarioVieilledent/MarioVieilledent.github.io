import { LuEye, LuEyeClosed } from "react-icons/lu";
import type { Source } from "../../types/types";
import { useTranslation } from "../../utils/TranslationContext";

const makePreviewUrl = (url: string): string =>
  url
    .replace("{z}", "3")
    .replace("{x}", "4")
    .replace("{y}", "2")
    .replace("{a-c}", "a");

const LayerButton = ({
  l,
  layers,
  setLayers,
  globeView,
}: {
  l: Source;
  layers: string[];
  setLayers: React.Dispatch<React.SetStateAction<string[]>>;
  globeView: boolean;
}) => {
  const { t } = useTranslation();
  const isOverlay = l.type.startsWith("overlay");
  const isSelected = layers.includes(l.name);
  const isUnavailable = globeView && l.unsupportedIn3D === true;

  return (
    <div
      key={l.name}
      title={isUnavailable ? t("notAvailableIn3D") : undefined}
      className={`flex items-center gap-2 rounded-xl py-1 pr-3 transition-colors ${
        isUnavailable
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer"
      } ${
        isSelected
          ? "bg-amber-50 ring-1 ring-amber-300"
          : isUnavailable
            ? ""
            : "hover:bg-stone-100"
      }`}
      onClick={() => {
        if (isUnavailable) return;

        if (isOverlay) {
          if (layers.includes(l.name)) {
            setLayers((prev) => prev.filter((lay) => lay !== l.name));
          } else {
            setLayers((prev) => [...prev, l.name]);
          }
        } else {
          setLayers((prev) => [l.name, ...prev.slice(1)]);
        }
      }}
    >
      <img
        className="h-12 w-12 rounded-lg object-cover"
        src={makePreviewUrl(l.url)}
        alt={`Map preview (${l.name})`}
      />
      {isOverlay &&
        (isSelected ? (
          <LuEye className="h-4 w-4 shrink-0 text-amber-600" />
        ) : (
          <LuEyeClosed className="h-4 w-4 shrink-0 text-stone-400" />
        ))}
      <span
        className={`text-xs ${isSelected ? "font-semibold text-amber-800" : "text-stone-700"}`}
      >
        {l.name}
      </span>
    </div>
  );
};

export default LayerButton;
