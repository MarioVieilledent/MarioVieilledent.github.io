import { LuDownload, LuLink } from "react-icons/lu";
import { Link } from "react-router";
import { useIsMobile } from "../../utils/isMobileHook";
import { useTranslation, type TermKeys } from "../../utils/TranslationContext";
import { randomIndexBasedOnDate } from "../../utils/utils";
import { RECIPES_PATH } from "../../utils/routes";
import { categories, categoryEmoji } from "../../utils/recipeCategories";
import type { Feast, Recipe } from "../../utils/validator";
import RecipeCard from "./RecipeCard";

interface RecipesHomeProps {
  feasts: Feast[];
  recipes: Recipe[];
}

const recipeWithCheese = 1; // La pizza margheritta :c

// Picks a representative picture for a category tile, rotating daily like
// the random recipe below, so the tiles aren't frozen on the same image.
const pictureForCategory = (
  category: string,
  recipes: Recipe[],
  feasts: Feast[],
): string | undefined => {
  const pool =
    category === "feasts"
      ? feasts.filter((f) => f.pictures.length > 0)
      : recipes.filter((r) => r.category === category && r.pictures.length > 0);

  return pool.length > 0
    ? pool[randomIndexBasedOnDate(pool.length)].pictures[0]
    : undefined;
};

const countForCategory = (
  category: string,
  recipes: Recipe[],
  feasts: Feast[],
): number =>
  category === "feasts"
    ? feasts.length
    : recipes.filter((r) => r.category === category).length;

const RecipesHome = ({ feasts, recipes }: RecipesHomeProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const randomRecipe =
    recipes.length > 0
      ? recipes[randomIndexBasedOnDate(recipes.length)]
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

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-stone-900">
          {t("browseCategories")}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((category) => {
            const picture = pictureForCategory(category, recipes, feasts);
            const count = countForCategory(category, recipes, feasts);

            return (
              <Link
                key={category}
                to={`${RECIPES_PATH}/${category}`}
                className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl border border-stone-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {picture ? (
                  <img
                    src={`/food/${picture}`}
                    alt={t(category as TermKeys)}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src="/noPicturePlaceholder.png"
                    alt="No picture placeholder"
                    className="absolute inset-0 h-full w-full bg-stone-50 object-contain p-8"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="relative flex w-full items-center justify-between gap-2 p-4">
                  <span className="text-lg font-semibold text-white">
                    {categoryEmoji(category)} {t(category as TermKeys)}
                  </span>
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {count}
                  </span>
                </div>
              </Link>
            );
          })}
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
    </div>
  );
};

export default RecipesHome;
