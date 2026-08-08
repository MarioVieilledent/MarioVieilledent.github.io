import { LuDownload, LuLink } from "react-icons/lu";
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

const recipeWithCheese = 1; // La pizza margheritta :c

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
          feasts[0],
        )
      : undefined;

  return (
    <div className={isMobile ? "flex flex-col gap-10 px-4 pb-8" : "flex flex-col gap-10 pb-8"}>
      <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-6 md:p-8">
        <div className="flex flex-col gap-2 text-stone-700">
          <p>{t("recipesPageDescription1")}</p>
          <p>{t("recipesPageDescription2")}</p>
          <p>{t("recipesPageDescription3")}</p>
        </div>
      </div>

      {recipes.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-stone-900">
            {t("statistics")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-4">
              <span className="text-3xl font-bold text-amber-600">
                {recipes.length}
              </span>
              <span className="text-xs text-stone-500">
                {t("recipesNumber")}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-4">
              <span className="text-3xl font-bold text-amber-600">
                {recipeWithCheese}
              </span>
              <span className="text-xs text-stone-500">
                {t("recipesWithCheese")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:border-amber-300 hover:text-amber-700"
              href="https://photos.app.goo.gl/yhvnvTkcjudMB88S8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LuLink size="16" />
              {t("picturesOfMyDishes")}
            </a>
            <a
              className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:border-amber-300 hover:text-amber-700"
              href="feasts.json"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LuDownload size="16" />
              {t("allFeastsJSON")}
            </a>
            <a
              className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:border-amber-300 hover:text-amber-700"
              href="recipes.json"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LuDownload size="16" />
              {t("allRecipesJSON")}
            </a>
          </div>
        </div>
      )}

      {randomRecipe && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-stone-900">
            {t("randomRecipe")}
          </h2>
          <div className="max-w-sm">
            <RecipeCard recipe={randomRecipe} />
          </div>
        </div>
      )}

      {lastFeast && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-stone-900">
            {t("lastFeast")}
          </h2>
          <div className="max-w-sm">
            <FeastCard feast={lastFeast} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesHome;
