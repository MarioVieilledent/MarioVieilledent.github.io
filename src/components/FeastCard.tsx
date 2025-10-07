import type { Feast, FeastDetails } from "../pages/Recipes";
import { useIsMobile } from "../utils/isMobileHook";
import { useTranslation } from "../utils/TranslationContext";
import { formatDate } from "../utils/utils";

const FeastCard = ({ feast }: { feast: Feast }) => {
  const { language } = useTranslation();
  const isMobile = useIsMobile();

  const details = feast[language as keyof Feast]
    ? (feast[language as keyof Feast] as FeastDetails)
    : feast.en;

  return (
    <div className={isMobile ? "flex flex-col fap-4" : "flex gap-4 w-full"}>
      {feast.pictures.length > 0 ? (
        <img
          src={`/food/${feast.pictures[0]}`}
          alt="Feast picture"
          className={isMobile ? "w-full" : "w-64 h-64 min-w-64 object-cover"}
        />
      ) : (
        <img
          src="/noPicturePlaceholder.png"
          alt="No picture placeholder"
          className="w-32 h-32"
        />
      )}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-4">
          <img
            className="w-8"
            src={`/flags/${feast.countryCode}.svg`}
            alt="Feast flag icon"
          />
          <div className="text-lg">{details.name}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg">{`#${feast.mealNumber}`}</div>
          <div className="text-sm text-gray-600">
            {formatDate(feast.date, language)}
          </div>
          <div className="text-sm  bg-gray-100 rounded-full p-2">{`${feast.ranking}/10`}</div>
        </div>

        <div className="flex items-center gap-4 text-sm whitespace-pre-line text-ellipsis overflow-hidden text-start line-clamp-1">
          {details.menu.map((str) => `\t- ${str}`).join("\n")}
        </div>
      </div>
    </div>
  );
};

export default FeastCard;
