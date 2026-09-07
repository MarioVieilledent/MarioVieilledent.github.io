import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  LuBuilding2,
  LuFlag,
  LuSearch,
  LuShapes,
  LuSparkles,
  LuX,
} from "react-icons/lu";
import z from "zod";
import PageWrapper from "../components/PageWrapper";
import { countryType, type CountryType } from "../utils/validator";
import FlagCard from "../components/flags/FlagCard";
import CountryShape from "../components/flags/CountryShape";
import CountryQuiz, {
  type QuizMode,
} from "../components/flags/CountryQuiz";
import Navbar from "../components/Navbar";
import { searchCountries } from "../utils/countrySearch";
import { useTranslation } from "../utils/TranslationContext";

type TabId = "flags" | "outlines" | "flag-quiz" | "outline-quiz" | "capital-quiz";
type QuizCountry = CountryType & { threeLetterCode: string };

type ShapeData = {
  source: {
    name: string;
    url: string;
    license: string;
    scale: string;
  };
  shapes: Record<string, string>;
};

const tabs: Array<{
  id: TabId;
  label: string;
  icon: ReactNode;
}> = [
  { id: "flags", label: "Flag gallery", icon: <LuFlag aria-hidden="true" /> },
  {
    id: "outlines",
    label: "Outline gallery",
    icon: <LuShapes aria-hidden="true" />,
  },
  {
    id: "flag-quiz",
    label: "Flag challenge",
    icon: <LuSparkles aria-hidden="true" />,
  },
  {
    id: "outline-quiz",
    label: "Outline challenge",
    icon: <LuSparkles aria-hidden="true" />,
  },
  {
    id: "capital-quiz",
    label: "Capital challenge",
    icon: <LuBuilding2 aria-hidden="true" />,
  },
];

const isQuizCountry = (country: CountryType): country is QuizCountry =>
  Boolean(country.threeLetterCode);

const quizModeByTab: Partial<Record<TabId, QuizMode>> = {
  "flag-quiz": "flag",
  "outline-quiz": "outline",
  "capital-quiz": "capital",
};

const Countries = () => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [shapeData, setShapeData] = useState<ShapeData | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("flags");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/countries.json").then((response) => {
        if (!response.ok) throw new Error("Could not load country data.");
        return response.json();
      }),
      fetch("/country-shapes.json").then((response) => {
        if (!response.ok) throw new Error("Could not load country outlines.");
        return response.json();
      }),
    ])
      .then(([countryData, outlineData]: [unknown, ShapeData]) => {
        setCountries(z.array(countryType).parse(countryData));
        setShapeData(outlineData);
      })
      .catch((fetchError: unknown) => {
        console.error("Error loading country explorer:", fetchError);
        setError("The country data could not be loaded. Please try again.");
      });
  }, []);

  const sovereignCountries = useMemo(
    () => countries.filter(isQuizCountry),
    [countries],
  );
  const visibleCountries = useMemo(
    () => searchCountries(sovereignCountries, query),
    [query, sovereignCountries],
  );
  const quizMode = quizModeByTab[activeTab];
  const isGallery = activeTab === "flags" || activeTab === "outlines";

  return (
    <>
      <Navbar />
      <PageWrapper>
        <main className="px-4 pb-12 pt-4 sm:px-0 sm:pt-6">
          <header className="mb-8">
            <div className="mt-6 max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Country explorer
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                {t("countries")}
              </h1>
              <p className="mt-3 text-stone-600">
                Browse every sovereign country, then test how many you can
                recognise.
              </p>
            </div>
          </header>

          <div
            role="tablist"
            aria-label="Country explorer sections"
            className="mb-8 flex gap-2 overflow-x-auto border-b border-stone-200 pb-3"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`${tab.id}-tab`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls="country-tab-panel"
                onClick={() => {
                  setActiveTab(tab.id);
                  setQuery("");
                }}
                className={
                  activeTab === tab.id
                    ? "flex shrink-0 items-center gap-2 rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
                    : "flex shrink-0 items-center gap-2 rounded-full bg-stone-100 px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-200 hover:text-stone-900"
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div
            id="country-tab-panel"
            role="tabpanel"
            aria-labelledby={`${activeTab}-tab`}
          >
            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800"
              >
                {error}
              </div>
            )}

            {!error && (!shapeData || countries.length === 0) && (
              <div className="py-24 text-center text-stone-500">
                Loading countries…
              </div>
            )}

            {!error && shapeData && countries.length > 0 && (
              <>
                {isGallery && (
                  <>
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="relative w-full max-w-md">
                        <LuSearch
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                        />
                        <label htmlFor="country-search" className="sr-only">
                          Search countries, capitals, or country codes
                        </label>
                        <input
                          id="country-search"
                          type="search"
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Fuzzy search countries, capitals or codes…"
                          className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-11 pr-11 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                        />
                        {query && (
                          <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label="Clear search"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                          >
                            <LuX aria-hidden="true" />
                          </button>
                        )}
                      </div>
                      <p className="shrink-0 text-sm text-stone-500">
                        {visibleCountries.length}{" "}
                        {visibleCountries.length === 1 ? "country" : "countries"}
                      </p>
                    </div>

                    {visibleCountries.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-stone-300 py-20 text-center">
                        <p className="font-medium text-stone-700">
                          No countries found
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                          Try a shorter name or a country code.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {visibleCountries.map((country) =>
                          activeTab === "flags" ? (
                            <FlagCard key={country.code} country={country} />
                          ) : (
                            <article
                              key={country.code}
                              className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                            >
                              <CountryShape
                                path={shapeData.shapes[country.threeLetterCode]}
                                label={`Outline of ${country.name}`}
                                className="h-28 w-full text-emerald-800"
                              />
                              <span
                                className="mt-2 truncate text-xs text-stone-600"
                                title={country.name}
                              >
                                {country.name}
                              </span>
                            </article>
                          ),
                        )}
                      </div>
                    )}

                    {activeTab === "outlines" && (
                      <p className="mt-8 text-center text-xs text-stone-500">
                        Boundary data:{" "}
                        <a
                          href={shapeData.source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-stone-300 underline-offset-2 hover:text-stone-800"
                        >
                          {shapeData.source.name}
                        </a>{" "}
                        ({shapeData.source.scale}, {shapeData.source.license}).
                      </p>
                    )}
                  </>
                )}

                {quizMode && (
                  <CountryQuiz
                    key={quizMode}
                    mode={quizMode}
                    countries={sovereignCountries}
                    shapes={shapeData.shapes}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </PageWrapper>
    </>
  );
};

export default Countries;
