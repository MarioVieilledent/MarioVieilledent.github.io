import type { Source } from "../utils/constants";
import { useIsMobile } from "../utils/isMobileHook";

const makePreviewUrl = (url: string): string =>
  url
    .replace("{z}", "4")
    .replace("{x}", "8")
    .replace("{y}", "5")
    .replace("{a-c}", "a");

const LayerButton = ({
  l,
  layers,
  setLayers,
}: {
  l: Source;
  layers: string[];
  setLayers: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const isMobile = useIsMobile();

  const isOverlay = l.type.startsWith("overlay");
  const isSelected = layers.includes(l.name);

  return (
    <div
      key={l.name}
      className={`flex items-center cursor-pointer rounded-md ${
        isMobile ? "flex-col text-center" : "gap-2 pr-2"
      } ${
        isSelected ? `border-2 border-black` : `border-2 border-transparent`
      }`}
      onClick={() => {
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
        className="w-12 h-12"
        src={makePreviewUrl(l.url)}
        alt={`Map preview (${l.name})`}
      />
      <span>{l.name}</span>
    </div>
  );
};

export default LayerButton;
