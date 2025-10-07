import { useEffect, useState } from "react";
import GoBackHome from "../components/GoBackHome";
import LanguageSelection from "../components/LanguageSelection";
import { useTranslation } from "../utils/TranslationContext";
import websiteLogo from "/favicon.png";
import FeastCard from "../components/FeastCard";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import RecipeCard from "../components/RecipeCard";
import { useIsMobile } from "../utils/isMobileHook";
import RecipeDisplay from "../components/RecipeDisplay";
import { RECIPES_PATH } from "../utils/routes";
import NotFound from "./NotFound";
import FeastDisplay from "../components/FeastDisplay";
import { feast, recipe, type Feast, type Recipe } from "../utils/validator";
import z from "zod";

const categories = [
  "feasts",
  "soupsAndBroths",
  "riceAndPasta",
  "meatAndFish",
  "doughAndBread",
  "pizzas",
  "sweet",
] as const;

const Recipes = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [feasts, setFeasts] = useState<Feast[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === RECIPES_PATH) {
      navigate(`${RECIPES_PATH}/${categories[0]}`);
    }
  }, [location, navigate]);

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
    <div className="flex flex-col max-w-4xl mx-auto gap-8">
      {isMobile ? (
        <div className="flex gap-8  p-2 justify-between items-center">
          <GoBackHome />
          <select
            onChange={(event) =>
              navigate(`${RECIPES_PATH}/${event.target.value}`)
            }
          >
            {categories.map((tab) => (
              <option key={tab} value={tab}>
                {t(tab)}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>
          <div className="flex gap-8 justify-between">
            <div className="flex gap-8 items-center">
              <GoBackHome />
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
                {t(tab)}
              </a>
            ))}
          </div>

          <div className="w-full h-0.25 bg-black"></div>
        </>
      )}

      <div className="flex flex-col gap-8 pb-8">
        <Routes>
          <Route
            path=""
            index
            element={
              <div className={isMobile ? "p-4" : ""}>
                {t("recipesPageDescription")}
              </div>
            }
          />
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
                <NotFound />
              )
            }
          />
          <Route
            path={":category"}
            element={recipes
              .filter((recipe) => location.pathname.includes(recipe.category))
              .map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}
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
                <NotFound />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Recipes;
