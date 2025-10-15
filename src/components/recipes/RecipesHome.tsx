import { useIsMobile } from "../../utils/isMobileHook";
import { useTranslation } from "../../utils/TranslationContext";

const RecipesHome = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "p-4" : ""}>{t("recipesPageDescription")}</div>
  );
};

export default RecipesHome;
