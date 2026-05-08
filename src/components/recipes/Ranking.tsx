import { useTranslation } from "../../utils/TranslationContext";

const Ranking = ({ ranking }: { ranking: number | undefined }) => {
  const { t } = useTranslation();

  if (typeof ranking === "number") {
    return (
      <div className="text-md bg-gray-300 rounded-full px-4 py-2">{`${ranking}/10`}</div>
    );
  } else {
    return (
      <div className="text-sm bg-gray-300 rounded-full px-4 py-2">
        {t("noRanking")}
      </div>
    );
  }
};

export default Ranking;
