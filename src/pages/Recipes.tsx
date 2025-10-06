import { useState } from "react";
import GoBackHome from "../components/GoBackHome";
import LanguageSelection from "../components/LanguageSelection";
import { useTranslation } from "../utils/TranslationContext";
import websiteLogo from "/favicon.png";
import FeastCard from "../components/FeastCard";
import { Route, Routes, useLocation, useNavigate } from "react-router";

const categories = [
  "feasts",
  "soupsAndBroths",
  "riceAndPasta",
  "meatAndFish",
  "pizzas",
  "sweet",
] as const;

type Category = (typeof categories)[number];

interface RecipeDetails {
  name: string;
  ingredients?: string[];
  instructions: string[];
  note?: string;
}

export interface Recipe {
  category: Category;
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

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [feasts, setFeasts] = useState<Feast[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  fetch("/recipes.json")
    .then((response) => response.json())
    .then((data) => setRecipes(data))
    .catch((error) => console.error("Error fetching recipes:", error));

  fetch("/feasts.json")
    .then((response) => response.json())
    .then((data) => setFeasts(data))
    .catch((error) => console.error("Error fetching feasts:", error));

  return (
    <div className="flex flex-col max-w-4xl mx-auto gap-8">
      <div className="flex gap-8 justify-between">
        <div className="flex gap-8 items-center">
          <GoBackHome />
          <img className="w-16 h-16" src={websiteLogo} alt="Website logo" />
        </div>
        <div className="flex gap-8 items-center grow">
          <input type="text" className="w-full" />
        </div>
        <div className="flex gap-8 items-center">
          <LanguageSelection />
        </div>
      </div>

      <div className="flex gap-8">
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

      <div className="flex flex-col gap-8">
        <Routes>
          <Route
            path="feasts"
            index
            element={feasts.map((feast, index) => (
              <FeastCard key={index} feast={feast} />
            ))}
          />
          <Route
            path="soupsAndBroths"
            element={<div>{"soupsAndBroths"}</div>}
          />
          <Route
            path={":category"}
            element={recipes
              .filter((recipe) => location.pathname.includes(recipe.category))
              .map((recipe, index) => (
                <div key={index}>{recipe.fr.name}</div>
              ))}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Recipes;
