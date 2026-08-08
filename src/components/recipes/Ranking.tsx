import { useTranslation } from "../../utils/TranslationContext";

const rankingColorClasses = (ranking: number): string => {
  if (ranking >= 8) return "bg-emerald-100 text-emerald-800";
  if (ranking >= 5) return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-800";
};

const Ranking = ({ ranking }: { ranking: number | undefined }) => {
  const { t } = useTranslation();

  if (typeof ranking === "number") {
    return (
      <div
        className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${rankingColorClasses(ranking)}`}
      >
        {`${ranking}/10`}
      </div>
    );
  }

  return (
    <div className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-500">
      {t("noRanking")}
    </div>
  );
};

export default Ranking;
