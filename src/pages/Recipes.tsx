import { useEffect, useRef, useState } from "react";
import Home from "../components/Home";
import LanguageSelection from "../components/LanguageSelection";
import { useTranslation, type TermKeys } from "../utils/TranslationContext";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router";
import { useIsMobile } from "../utils/isMobileHook";
import { RECIPES_PATH } from "../utils/routes";
import { feast, recipe, type Feast, type Recipe } from "../utils/validator";
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
import { categories, categoryEmoji } from "../utils/recipeCategories";

const REGEX_CATEGORY = /\/recipes\/(.*)/;
const REGEX_RECIPE = /\/recipes\/(.*)\/(.*)/;

const CARD_GRID = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

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

  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const tabNavDisplay = (tab: string): string =>
    `${categoryEmoji(tab)} ${t(tab as TermKeys)}`;

  useEffect(() => {
    if (searchModePhone) {
      phoneInputRef.current?.focus();
    }
  }, [searchModePhone]);

  useEffect(() => {
    if (location.pathname === RECIPES_PATH) {
      setCategory(undefined);
    } else {
      const match = REGEX_RECIPE.exec(location.pathname);
      if (match) {
        setCategory(match.length >= 2 ? match[1] : undefined);
      } else {
        const matchCategory = REGEX_CATEGORY.exec(location.pathname);
        setCategory(
          matchCategory && matchCategory.length >= 2
            ? matchCategory[1]
            : undefined,
        );
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

  const isActiveTab = (tab: string): boolean =>
    (tab === "home" && location.pathname.endsWith(`${RECIPES_PATH}`)) ||
    (tab !== "home" && location.pathname.includes(tab));

  const PhoneDrawer = () => (
    <>
      {phoneDrawer && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/30 backdrop-blur-sm"
          onClick={() => setPhoneDrawer(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 z-50 flex h-full w-4/5 max-w-xs flex-col gap-8 bg-white p-6 shadow-2xl transition-transform duration-200 ${
          phoneDrawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Home />
          <a
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
            onClick={() => setPhoneDrawer(false)}
          >
            <LuX size="20" />
          </a>
        </div>

        <LanguageSelection />

        <div className="flex flex-col gap-1">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
            {t("recipes")}
          </div>
          {["home", ...categories].map((tab) => (
            <Link
              key={tab}
              onClick={() => {
                navigate(`${RECIPES_PATH}/${tab}`);
                setPhoneDrawer(false);
              }}
              className={`rounded-xl px-3 py-2.5 text-base transition-colors ${
                isActiveTab(tab)
                  ? "bg-amber-50 font-semibold text-amber-700"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
              to={tab === "home" ? RECIPES_PATH : `${RECIPES_PATH}/${tab}`}
            >
              {tabNavDisplay(tab)}
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <PhoneDrawer />

      <div className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur-sm">
        <div className={isMobile ? "" : "mx-auto max-w-6xl px-8"}>
          {isMobile ? (
            <div className="flex h-16 items-center justify-between gap-2 px-4">
              {searchModePhone ? (
                <div className="flex h-10 grow items-center rounded-full border border-stone-200 bg-stone-50 px-4">
                  <LuSearch size="16" className="shrink-0 text-stone-400" />
                  <input
                    type="text"
                    className="h-full w-full bg-transparent px-2 outline-none"
                    placeholder={`${t("search")}...`}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    ref={phoneInputRef}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-stone-600 hover:bg-stone-100"
                    onClick={() => setPhoneDrawer(true)}
                  >
                    <LuMenu size="22" />
                  </a>

                  <div
                    className="flex items-center gap-3"
                    onClick={() => navigate(`${RECIPES_PATH}`)}
                  >
                    <img className="w-10" src={websiteLogo} alt="Website logo" />
                    <div className="text-lg font-semibold text-stone-900">
                      {category ? tabNavDisplay(category) : tabNavDisplay("home")}
                    </div>
                  </div>
                </div>
              )}
              <a
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-stone-600 hover:bg-stone-100"
                onClick={() => {
                  if (searchModePhone) {
                    setSearchModePhone(false);
                    setSearch("");
                  } else {
                    setSearchModePhone(true);
                  }
                }}
              >
                {searchModePhone ? <LuX size="20" /> : <LuSearch size="20" />}
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-3 py-3">
              <div className="flex h-10 items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                  <Home />
                  <span className="text-2xl font-bold tracking-tight text-stone-900">
                    {t("recipes")}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex h-10 w-72 items-center rounded-full border border-stone-200 bg-stone-50 px-4 transition-colors focus-within:border-amber-400 focus-within:bg-white">
                    <LuSearch size="16" className="shrink-0 text-stone-400" />
                    <input
                      ref={desktopInputRef}
                      type="text"
                      className="h-full w-full bg-transparent px-2 outline-none"
                      placeholder={`${t("search")}...`}
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                    {search && (
                      <button
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-stone-200"
                        onClick={() => setSearch("")}
                      >
                        <LuX size="14" />
                      </button>
                    )}
                  </div>

                  <LanguageSelection />
                </div>
              </div>

              {!search && (
                <div className="flex flex-wrap gap-1 rounded-full bg-stone-100 p-1">
                  {["home", ...categories].map((tab) => (
                    <Link
                      key={tab}
                      className={`grow rounded-full px-4 py-2 text-center text-sm whitespace-nowrap transition-colors ${
                        isActiveTab(tab)
                          ? "bg-white font-semibold text-amber-700 shadow-sm"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                      to={
                        tab === "home" ? RECIPES_PATH : `${RECIPES_PATH}/${tab}`
                      }
                    >
                      {tabNavDisplay(tab)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PageWrapper>
        <div className="flex flex-col gap-8 pt-8 pb-8">
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
                element={
                  <div className={isMobile ? `${CARD_GRID} px-4` : CARD_GRID}>
                    {feasts
                      .sort((a, b) => b.mealNumber - a.mealNumber)
                      .map((feast, index) => (
                        <FeastCard key={index} feast={feast} />
                      ))}
                  </div>
                }
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
                    <div className={isMobile ? `${CARD_GRID} px-4` : CARD_GRID}>
                      {recipes
                        .filter((recipe) =>
                          location.pathname.includes(recipe.category)
                        )
                        .map((recipe, index) => (
                          <RecipeCard key={index} recipe={recipe} />
                        ))}
                    </div>
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
    </div>
  );
};

export default Recipes;
