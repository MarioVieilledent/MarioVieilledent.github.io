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
              recipes.length - recipeWithCheese
            }`}</div>
            <div className="text-sm">{`${t("recipesWithCheese")} ${recipeWithCheese}`}</div>
          </div>

          <div>
            <div className="text-xl pt-4 pb-4">{t("picturesOfMyDishes")}</div>
            <a
              className="flex items-center gap-2 cursor-pointer text-sm"
              href="https://photos.app.goo.gl/yhvnvTkcjudMB88S8"
              target="_blank"
            >
              <LuLink size="16" />
              Google Photos
            </a>
          </div>

          <div className="text-xl pt-4">{t("export")}</div>
          <div className="flex flex-col gap-4">
            <a
              className="flex items-center gap-2 cursor-pointer text-sm"
              href="feasts.json"
              target="_blank"
            >
              <LuDownload size="16" />
              {t("allFeastsJSON")}
            </a>
            <a
              className="flex items-center gap-2 cursor-pointer text-sm"
              href="recipes.json"
              target="_blank"
            >
              <LuDownload size="16" />
              {t("allRecipesJSON")}
            </a>
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
