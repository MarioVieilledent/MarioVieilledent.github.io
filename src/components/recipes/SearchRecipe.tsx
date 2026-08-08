import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useIsMobile } from "../../utils/isMobileHook";
import { useTranslation } from "../../utils/TranslationContext";
import type { Feast, Recipe } from "../../utils/validator";
import RecipeCard from "./RecipeCard";
import FeastCard from "./FeastCard";

interface SearchPageProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  recipes: Recipe[];
  feasts: Feast[];
}

const CARD_GRID = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

const SearchPage = ({
  search,
  setSearch,
  recipes,
  feasts,
}: SearchPageProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [matchingRecipes, setMatchingRecipes] = useState<Recipe[]>([]);
  const [matchingFeasts, setMatchingFeasts] = useState<Feast[]>([]);

  useEffect(() => {
    const sanitizedSearch = search.trim().toLocaleLowerCase();

    if (search) {
      setMatchingRecipes(
        recipes.filter((r) => {
          const sanitizedRecipe = JSON.stringify(r).toLocaleLowerCase();
          return sanitizedRecipe.includes(sanitizedSearch);
        })
      );
      setMatchingFeasts(
        feasts.filter((f) => {
          const sanitizedFeast = JSON.stringify(f).toLocaleLowerCase();
          return sanitizedFeast.includes(sanitizedSearch);
        })
      );
    } else {
      setMatchingRecipes([]);
      setMatchingFeasts([]);
    }
  }, [search, recipes, feasts]);

  return (
    <div className="flex flex-col gap-10">
      <div
        className={`flex items-center justify-between gap-4 ${isMobile ? "px-4" : ""}`}
      >
        <div className="text-stone-600">
          {`"${search}" — ${
            matchingRecipes.length + matchingFeasts.length
          } ${t("restultsFound")}`}
        </div>
        {!isMobile && (
          <button
            className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm text-stone-600 transition-colors hover:border-amber-300 hover:text-amber-700"
            onClick={() => setSearch("")}
          >
            {t("clearFilters")}
          </button>
        )}
      </div>

      {matchingRecipes.length > 0 && (
        <div className="flex flex-col gap-4">
          <div
            className={`text-xl font-semibold text-stone-900 ${isMobile ? "px-4" : ""}`}
          >
            {t("recipes")}
          </div>
          <div className={isMobile ? `${CARD_GRID} px-4` : CARD_GRID}>
            {matchingRecipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} setSearch={setSearch} />
            ))}
          </div>
        </div>
      )}

      {matchingFeasts.length > 0 && (
        <div className="flex flex-col gap-4">
          <div
            className={`text-xl font-semibold text-stone-900 ${isMobile ? "px-4" : ""}`}
          >
            {t("feasts")}
          </div>
          <div className={isMobile ? `${CARD_GRID} px-4` : CARD_GRID}>
            {matchingFeasts.map((feast, index) => (
              <FeastCard key={index} feast={feast} setSearch={setSearch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
