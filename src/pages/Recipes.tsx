import { useEffect, useRef, useState } from "react";
import Home from "../components/Home";
import LanguageSelection from "../components/LanguageSelection";
import { useTranslation } from "../utils/TranslationContext";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router";
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
import SearchPage from "../components/recipes/SearchRecipe";
import { LuX, LuMenu, LuSearch } from "react-icons/lu";
import websiteLogo from "/favicon.png";

const REGEX_CATEGORY = /\/recipes\/(.*)/;
const REGEX_RECIPE = /\/recipes\/(.*)\/(.*)/;

const categories = [
  "feasts",
  "starters",
  "mainCourses",
  "desserts",
  "breads",
  "dips",
] as const;

const Recipes = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [phoneDrawer, setPhoneDrawer] = useState(false);
  const [searchModePhone, setSearchModePhone] = useState(false);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [feasts, setFeasts] = useState<Feast[]>([]);

  const [category, setCategory] = useState<string | undefined>(undefined);
  const [element, setElement] = useState<string | undefined>(undefined);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const tabNavDisplay = (tab: string): string => {
    switch (tab) {
      case "home":
        return `🏠 ${t("home")}`;
      case "feasts":
        return `🍽️ ${t("feasts")}`;
      case "starters":
        return `🥗 ${t("starters")}`;
      case "mainCourses":
        return `🍝 ${t("mainCourses")}`;
      case "desserts":
        return `🍰 ${t("desserts")}`;
      case "breads":
        return `🥖 ${t("breads")}`;
      case "dips":
        return `🥣 ${t("dips")}`;
      default:
        return "";
    }
  };

  useEffect(() => {
    if (searchModePhone) {
      phoneInputRef.current?.focus();
    }
  }, [searchModePhone]);

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

  // Enforce ctrl f focusing on search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        desktopInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const PhoneDrawer = () => (
    <div
      className={`flex flex-col gap-8 p-4 fixed top-0 left-0 h-full w-4/5 bg-white bg-opacity-90 transition-transform duration-200 ${
        phoneDrawer ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <a
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setPhoneDrawer(false)}
      >
        <LuX size="32" />
      </a>

      <LanguageSelection />

      <Home />

      <div className="flex flex-col gap-4">
        <div>{t("recipes")}</div>
        {["home", ...categories].map((tab) => (
          <Link
            key={tab}
            onClick={() => {
              navigate(`${RECIPES_PATH}/${tab}`);
              setPhoneDrawer(false);
            }}
            className={
              (tab === "home" &&
                location.pathname.endsWith(`${RECIPES_PATH}`)) ||
              (tab !== "home" && location.pathname.includes(tab))
                ? "pl-8 text-lg font-bold"
                : "pl-8 text-lg "
            }
            to={tab === "home" ? RECIPES_PATH : `${RECIPES_PATH}/${tab}`}
          >
            {tabNavDisplay(tab)}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <PhoneDrawer />
      <PageWrapper>
        {isMobile ? (
          <div className="flex h-16 justify-between gap-4 bg-gray-200">
            {searchModePhone ? (
              <div className="flex w-64 h-8 self-center px-4">
                <input
                  type="text"
                  className="grow px-2 h-full bg-gray-300"
                  placeholder={`${t("search")}...`}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  ref={phoneInputRef}
                />
              </div>
            ) : (
              <div className="flex">
                <a
                  className="flex items-center justify-center w-16 h-16"
                  onClick={() => setPhoneDrawer(true)}
                >
                  <LuMenu size="24" />
                </a>

                <div
                  className="flex items-center gap-4"
                  onClick={() => navigate(`${RECIPES_PATH}`)}
                >
                  <img className="w-16" src={websiteLogo} alt="Website logo" />

                  {category ? (
                    <div className="text-lg">{tabNavDisplay(category)}</div>
                  ) : (
                    <div className="text-lg">{tabNavDisplay("home")}</div>
                  )}
                </div>
              </div>
            )}
            <div className="flex">
              <a
                className="flex items-center justify-center w-16 h-16 cursor-pointer"
                onClick={() => {
                  if (searchModePhone) {
                    setSearchModePhone(false);
                    setSearch("");
                  } else {
                    setSearchModePhone(true);
                  }
                }}
              >
                {searchModePhone ? <LuX size="24" /> : <LuSearch size="24" />}
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 bg-gray-200">
            <div className="flex h-16 gap-8 px-4 items-center justify-between">
              <div className="flex gap-8 items-center">
                {element ? (
                  <NavigateTo location={`${RECIPES_PATH}/${category}`} />
                ) : category ? (
                  <NavigateTo location={`${RECIPES_PATH}`} />
                ) : (
                  <Home />
                )}
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex gap-8 items-center">
                  <span className="text-2xl">{t("recipes")}</span>
                </div>

                <div className="flex w-64 h-8 bg-gray-300">
                  <input
                    ref={desktopInputRef}
                    type="text"
                    className="grow px-2 h-full"
                    placeholder={`${t("search")}...`}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />

                  {search && (
                    <button
                      className="w-8 h-8 flex items-center justify-center"
                      onClick={() => setSearch("")}
                    >
                      <LuX size="16" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-8 items-center">
                <LanguageSelection />
              </div>
            </div>

            <div className="flex flex-col">
              {!search && (
                <div className="flex h-12 justify-between">
                  {["home", ...categories].map((tab) => (
                    <Link
                      key={tab}
                      className={
                        (tab === "home" &&
                          location.pathname.endsWith(`${RECIPES_PATH}`)) ||
                        (tab !== "home" && location.pathname.includes(tab))
                          ? "h-full text-center grow cursor-pointer font-bold bg-gray-300"
                          : "h-full text-center grow cursor-pointer"
                      }
                      to={
                        tab === "home" ? RECIPES_PATH : `${RECIPES_PATH}/${tab}`
                      }
                    >
                      <div className="h-full flex items-center justify-center">
                        <div>{tabNavDisplay(tab)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <div className="w-full h-0.25 bg-black"></div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8 pb-8">
          {search ? (
            <SearchPage
              search={search}
              setSearch={setSearch}
              recipes={recipes}
              feasts={feasts}
            />
          ) : (
            <Routes>
              <Route
                path=""
                index
                element={<RecipesHome recipes={recipes} feasts={feasts} />}
              />
              <Route
                path="feasts"
                element={feasts
                  .sort((a, b) => b.mealNumber - a.mealNumber)
                  .map((feast, index) => (
                    <FeastCard key={index} feast={feast} />
                  ))}
              />
              <Route
                path={"/feasts/:feast"}
                element={
                  feasts.find((feast) =>
                    location.pathname.includes(feast.id)
                  ) ? (
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
                  !category ||
                  !([...categories] as string[]).includes(category) ? (
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
          )}
        </div>
      </PageWrapper>
    </>
  );
};

export default Recipes;
