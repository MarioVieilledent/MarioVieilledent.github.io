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
    <div className="flex flex-col gap-8">
      <div
        className={isMobile ? "flex flex-col gap-4 p-4" : "flex flex-col gap-4"}
      >
        {!isMobile && (
          <button
            className="self-start px-2 border rounded bg-blue-300 text-sm"
            onClick={() => setSearch("")}
          >
            {t("clearFilters")}
          </button>
        )}

        <div>{`"${search}" - ${
          matchingRecipes.length + matchingFeasts.length
        } ${t("restultsFound")}`}</div>
      </div>

      {matchingRecipes.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className={isMobile ? "text-xl px-4" : "text-xl"}>
            {t("recipes")}
          </div>
          {matchingRecipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} setSearch={setSearch} />
          ))}
        </div>
      )}

      {matchingFeasts.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className={isMobile ? "text-xl px-4" : "text-xl"}>
            {t("feasts")}
          </div>
          {matchingFeasts.map((feast, index) => (
            <FeastCard key={index} feast={feast} setSearch={setSearch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
