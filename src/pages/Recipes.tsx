import { useEffect, useState } from "react";
import GoBackHome from "../components/GoBackHome";
import LanguageSelection from "../components/LanguageSelection";
import { useTranslation } from "../utils/TranslationContext";
import websiteLogo from "/favicon.png";
import FeastCard from "../components/FeastCard";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import RecipeCard from "../components/RecipeCard";
import { useIsMobile } from "../utils/isMobileHook";

const categories = [
  "feasts",
  "soupsAndBroths",
  "riceAndPasta",
  "meatAndFish",
  "doughAndBread",
  "pizzas",
  "sweet",
] as const;

type Category = (typeof categories)[number];

export interface RecipeDetails {
  name: string;
  ingredients: string[] | { part: string; ingredients: string[] }[];
  instructions: string[] | { part: string; instructions: string[] }[];
  notes?: string;
}

export interface Recipe {
  category: Category;
  pictures: string[];
  en: RecipeDetails;
  fr: RecipeDetails;
  it: RecipeDetails;
  no?: RecipeDetails;
}

export interface FeastDetails {
  name: string;
  idea: string[];
  menu: string[];
  notes: {
    title: string;
    description: string[];
  };
}

export interface Feast {
  mealNumber: number;
  countryCode: string;
  date: string;
  ranking: number;
  pictures: string[];
  en: FeastDetails;
  fr: FeastDetails;
  it: FeastDetails;
  no?: FeastDetails;
}

const Recipes = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [feasts, setFeasts] = useState<Feast[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname === "/recipes") {
      navigate(`/recipes/${categories[0]}`);
    }
  }, [location, navigate]);

  useEffect(() => {
    fetch("/recipes.json")
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error fetching recipes:", error));

    fetch("/feasts.json")
      .then((response) => response.json())
      .then((data) => setFeasts(data))
      .catch((error) => console.error("Error fetching feasts:", error));
  }, []);

  return (
    <div className="flex flex-col max-w-4xl mx-auto gap-8">
      {isMobile ? (
        <div className="flex gap-8  p-2 justify-between items-center">
          <GoBackHome />
          <select
            onChange={(event) => navigate(`/recipes/${event.target.value}`)}
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
                onClick={() => navigate(`/recipes/${tab}`)}
              >
                {t(tab)}
              </a>
            ))}
          </div>

          <div className="w-full h-0.25 bg-black"></div>
        </>
      )}

      <div className="flex flex-col gap-8">
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
            path={":category"}
            element={recipes
              .filter((recipe) => location.pathname.includes(recipe.category))
              .map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Recipes;
