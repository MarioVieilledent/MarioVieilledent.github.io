import { useState } from "react";
import GoBackHome from "../components/GoBackHome";
import LanguageSelection from "../components/LanguageSelection";
import { useTranslation } from "../utils/TranslationContext";
import websiteLogo from "/favicon.png";

const categories = [
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

interface Recipe {
  category: Category;
  en: RecipeDetails;
  fr: RecipeDetails;
  it: RecipeDetails;
  no?: RecipeDetails;
}

const Recipes = () => {
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState<Category>("soupsAndBroths");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  fetch("/recipes.json")
    .then((response) => response.json())
    .then((data) => setRecipes(data))
    .catch((error) => console.error("Error fetching recipes:", error));

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
              tab === selectedTab
                ? "cursor-pointer underline"
                : "cursor-pointer"
            }
            onClick={() => setSelectedTab(tab)}
          >
            {t(tab)}
          </a>
        ))}
      </div>

      <div>
        {recipes
          .filter((recipe) => recipe.category === selectedTab)
          .map((recipe, index) => (
            <div key={index}>{recipe.fr.name}</div>
          ))}
      </div>
    </div>
  );
};

export default Recipes;
