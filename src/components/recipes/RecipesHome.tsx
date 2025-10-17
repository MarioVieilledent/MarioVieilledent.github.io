import { useIsMobile } from "../../utils/isMobileHook";
import { useTranslation } from "../../utils/TranslationContext";
import type { Feast, Recipe } from "../../utils/validator";
import FeastCard from "./FeastCard";
import RecipeCard from "./RecipeCard";

interface RecipesHomeProps {
  lastFeast?: Feast;
  randomRecipe?: Recipe;
}

const RecipesHome = ({ lastFeast, randomRecipe }: RecipesHomeProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <>
      <div className={isMobile ? "p-4" : ""}>{t("recipesPageDescription")}</div>
      {randomRecipe && (
        <>
          <div className="text-xl self-center pt-8 px-4">
            {t("randomRecipe")}
          </div>
          <RecipeCard recipe={randomRecipe} />
        </>
      )}
      {lastFeast && (
        <>
          <div className="text-xl self-center pt-8 px-4">{t("lastFeast")}</div>
          <FeastCard feast={lastFeast} />
        </>
      )}
    </>
  );
};

export default RecipesHome;
