import { LuEye, LuEyeClosed } from "react-icons/lu";
import type { Source } from "../../types/types";

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
}: {
  l: Source;
  layers: string[];
  setLayers: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const isOverlay = l.type.startsWith("overlay");
  const isSelected = layers.includes(l.name);

  return (
    <div
      key={l.name}
      className={`flex items-center gap-2 pr-2 cursor-pointer rounded-md ${
        isSelected
          ? `bg-gray-200 border-1 border-gray-500`
          : `border-1 border-transparent`
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
        className="w-12 h-12 rounded-md"
        src={makePreviewUrl(l.url)}
        alt={`Map preview (${l.name})`}
      />
      {isOverlay &&
        (isSelected ? (
          <LuEye className="w-4 h-4" />
        ) : (
          <LuEyeClosed className="w-4 h-4" />
        ))}
      <span className="text-xs">{l.name}</span>
    </div>
  );
};

export default LayerButton;
