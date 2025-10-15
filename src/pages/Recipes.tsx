import { useEffect, useState } from "react";
import Home from "../components/Home";
import LanguageSelection from "../components/LanguageSelection";
import { useTranslation } from "../utils/TranslationContext";
import websiteLogo from "/favicon.png";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { useIsMobile } from "../utils/isMobileHook";
import { RECIPES_PATH } from "../utils/routes";
import { feast, recipe, type Feast, type Recipe } from "../utils/validator";
import NavigateTo from "../components/NavigateTo";
import z from "zod";
import FeastCard from "../components/recipes/FeastCard";
import FeastDisplay from "../components/recipes/FeastDisplay";
import RecipeCard from "../components/recipes/RecipeCard";
import RecipeDisplay from "../components/recipes/RecipeDisplay";
import PageWrapper from "../components/PageWrapper";
import NotFoundRecipe from "../components/recipes/NotFoundRecipe";
import RecipesHome from "../components/recipes/RecipesHome";

const REGEX_CATEGORY = /\/recipes\/(.*)/;
const REGEX_RECIPE = /\/recipes\/(.*)\/(.*)/;

const categories = [
  "feasts",
  "soupsAndBroths",
  "doughAndBread",
  "mezesAndSauces",
  "riceAndPasta",
  "meatAndFish",
  "pizzas",
  "sweet",
] as const;

const Recipes = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [feasts, setFeasts] = useState<Feast[]>([]);

  const [category, setCategory] = useState<string | undefined>(undefined);
  const [element, setElement] = useState<string | undefined>(undefined);

  const navigate = useNavigate();
  const location = useLocation();

  const tabNavDisplay = (tab: (typeof categories)[number]) => `${t(tab)}`;

  useEffect(() => {
    if (location.pathname === RECIPES_PATH) {
      setCategory(undefined);
      setElement(undefined);
    } else {
      const match = REGEX_RECIPE.exec(location.pathname);
      if (match) {
        setCategory(match.length >= 2 ? match[1] : undefined);
        setElement(match.length >= 3 ? match[2] : undefined);
      } else {
        const matchCategory = REGEX_CATEGORY.exec(location.pathname);
        if (matchCategory) {
          setCategory(matchCategory.length >= 2 ? matchCategory[1] : undefined);
          setElement(undefined);
        } else {
          setCategory(undefined);
          setElement(undefined);
        }
      }
    }
  }, [location]);

  useEffect(() => {
    fetch("/recipes.json")
      .then((response) => response.json())
      .then((data: unknown) => setRecipes(z.array(recipe).parse(data)))
      .catch((error) => console.error("Error fetching recipes:", error));

    fetch("/feasts.json")
      .then((response) => response.json())
      .then((data: unknown) => setFeasts(z.array(feast).parse(data)))
      .catch((error) => console.error("Error fetching feasts:", error));
  }, []);

  return (
    <PageWrapper>
      {isMobile ? (
        <div className="flex gap-8 p-2 justify-between items-center">
          {element ? (
            <NavigateTo location={`${RECIPES_PATH}/${category}`} />
          ) : category ? (
            <NavigateTo location={`${RECIPES_PATH}`} />
          ) : (
            <Home />
          )}

          <LanguageSelection />

          <select
            onChange={(event) =>
              navigate(`${RECIPES_PATH}/${event.target.value}`)
            }
          >
            <option value="">{t("home")}</option>
            {categories.map((tab) => (
              <option key={tab} value={tab}>
                {tabNavDisplay(tab)}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>
          <div className="flex gap-8 justify-between">
            <div className="flex gap-8 items-center">
              {element ? (
                <NavigateTo location={`${RECIPES_PATH}/${category}`} />
              ) : category ? (
                <NavigateTo location={`${RECIPES_PATH}`} />
              ) : (
                <Home />
              )}
              <img className="w-16 h-16" src={websiteLogo} alt="Website logo" />
              <span className="text-2xl">{t("recipes")}</span>
            </div>
            <div className="flex gap-8 items-center grow">
              <input type="text" className="w-full" />
            </div>
            <div className="flex gap-8 items-center">
              <LanguageSelection />
            </div>
          </div>

          <div className="flex justify-between gap-8">
            {categories.map((tab) => (
              <a
                key={tab}
                className={
                  location.pathname.includes(tab)
                    ? "cursor-pointer underline"
                    : "cursor-pointer"
                }
                onClick={() => navigate(`${RECIPES_PATH}/${tab}`)}
              >
                {tabNavDisplay(tab)}
              </a>
            ))}
          </div>

          <div className="w-full h-0.25 bg-black"></div>
        </>
      )}

      <div className="flex flex-col gap-8 pb-8">
        <Routes>
          <Route path="" index element={<RecipesHome />} />
          <Route
            path="feasts"
            element={feasts.map((feast, index) => (
              <FeastCard key={index} feast={feast} />
            ))}
          />
          <Route
            path={"/feasts/:feast"}
            element={
              feasts.find((feast) => location.pathname.includes(feast.id)) ? (
                <FeastDisplay
                  feast={
                    feasts.find((feast) =>
                      location.pathname.includes(feast.id)
                    ) as Feast
                  }
                />
              ) : (
                <NotFoundRecipe />
              )
            }
          />
          <Route
            path={":category"}
            element={
              !category || !([...categories] as string[]).includes(category) ? (
                <NotFoundRecipe />
              ) : (
                recipes
                  .filter((recipe) =>
                    location.pathname.includes(recipe.category)
                  )
                  .map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe} />
                  ))
              )
            }
          />
          <Route
            path={":category/:recipe"}
            element={
              recipes.find((recipe) =>
                location.pathname.includes(recipe.id)
              ) ? (
                <RecipeDisplay
                  recipe={
                    recipes.find((recipe) =>
                      location.pathname.includes(recipe.id)
                    ) as Recipe
                  }
                />
              ) : (
                <NotFoundRecipe />
              )
            }
          />
        </Routes>
      </div>
    </PageWrapper>
  );
};

export default Recipes;
