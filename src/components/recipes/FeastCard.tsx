import { useNavigate } from "react-router";
import { RECIPES_PATH } from "../../utils/routes";
import { useTranslation } from "../../utils/TranslationContext";
import { formatDate } from "../../utils/utils";
import type { Feast, FeastDetails } from "../../utils/validator";
import type { Dispatch, SetStateAction } from "react";
import Ranking from "./Ranking";
import BulletList from "./BulletList";

interface FeastCardProps {
  feast: Feast;
  setSearch?: Dispatch<SetStateAction<string>>;
}

const FeastCard = ({ feast, setSearch }: FeastCardProps) => {
  const { language } = useTranslation();
  const navigate = useNavigate();

  const details = feast[language as keyof Feast]
    ? (feast[language as keyof Feast] as FeastDetails)
    : feast.en;

  return (
    <div
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      onClick={() => {
        navigate(`${RECIPES_PATH}/feasts/${feast.id}`);
        if (setSearch) {
          setSearch("");
        }
      }}
    >
      {feast.pictures.length > 0 ? (
        <img
          src={`/food/${feast.pictures[0]}`}
          alt={details.name}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <img
          src="/noPicturePlaceholder.png"
          alt="No picture placeholder"
          className="aspect-[4/3] w-full object-contain bg-stone-50 p-8"
        />
      )}
      <div className="flex grow flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <img
              className="h-6 w-6 shrink-0 rounded-full border border-stone-200 object-cover"
              src={`/flags/${feast.countryCode}.svg`}
              alt="Feast flag icon"
            />
            <div className="truncate text-lg font-semibold text-stone-900">
              {details.name}
            </div>
          </div>
          <Ranking ranking={feast.ranking} />
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span className="font-medium text-stone-700">{`#${feast.mealNumber}`}</span>
          <span>{formatDate(feast.date, language)}</span>
        </div>

        <BulletList items={details.menu} maxItems={4} />
      </div>
    </div>
  );
};

export default FeastCard;
