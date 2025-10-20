import { useIsMobile } from "../../utils/isMobileHook";
import { useTranslation } from "../../utils/TranslationContext";
import { randomIndexBasedOnDate } from "../../utils/utils";
import type { Feast, Recipe } from "../../utils/validator";
import FeastCard from "./FeastCard";
import RecipeCard from "./RecipeCard";

interface RecipesHomeProps {
  feasts: Feast[];
  recipes: Recipe[];
}

const RecipesHome = ({ feasts, recipes }: RecipesHomeProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const randomRecipe =
    recipes.length > 0
      ? recipes[randomIndexBasedOnDate(recipes.length)]
      : undefined;

  const lastFeast =
    feasts.length > 0
      ? feasts.reduce(
          (acc, f) => (acc.mealNumber > f.mealNumber ? acc : f),
          feasts[0]
        )
      : undefined;

  return (
    <>
      <div
        className={
          isMobile ? "p-4 text-md text-gray-700" : " text-md text-gray-700"
        }
      >
        {t("recipesPageDescription")}
      </div>
      {recipes.length > 0 && (
        <div
          className={
            isMobile ? "flex flex-col gap-4 pl-4" : "flex flex-col gap-4"
          }
        >
          <div className="text-xl pt-4">{t("statistics")}</div>
          <div className="flex flex-col">
            <div className="text-sm">{`${t("recipesNumber")} ${
              recipes.length
            }`}</div>
            <div className="text-sm">{`${t("recipesWithCheese")} ${0}`}</div>
          </div>
        </div>
      )}
      {randomRecipe && (
        <>
          <div className={isMobile ? "text-xl pt-4 pl-4" : "text-xl pt-4"}>
            {t("randomRecipe")}
          </div>
          <RecipeCard recipe={randomRecipe} />
        </>
      )}
      {lastFeast && (
        <>
          <div className={isMobile ? "text-xl pt-4 pl-4" : "text-xl pt-4"}>
            {t("lastFeast")}
          </div>
          <FeastCard feast={lastFeast} />
        </>
      )}
    </>
  );
};

export default RecipesHome;
