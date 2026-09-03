import { useState } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import { useNavigate } from "react-router";
import { LANGUAGE_QUERY_PARAM } from "../../utils/constants";
import {
  languages,
  useTranslation,
  type LanguagesAvailable,
} from "../../utils/TranslationContext";
import { RECIPES_PATH } from "../../utils/routes";
import type {
  Feast,
  FeastDetails,
  Recipe,
  RecipeDetails,
} from "../../utils/validator";

interface TranslationCoverageTableProps {
  feasts: Feast[];
  recipes: Recipe[];
}

interface CoverageRow {
  id: string;
  label: string;
  kind: "Feast" | "Recipe";
  path: string;
  source: Feast | Recipe;
}

interface HoveredCell {
  column: LanguagesAvailable;
  row: string;
}

const hasTranslation = (
  source: Feast | Recipe,
  language: LanguagesAvailable,
): boolean => Boolean(source[language as keyof typeof source]);

const TranslationCoverageTable = ({
  feasts,
  recipes,
}: TranslationCoverageTableProps) => {
  const { language, setLanguage, t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);

  const rows: CoverageRow[] = [
    ...feasts.map((feast) => ({
      id: `feast-${feast.id}`,
      label: (
        (feast[language as keyof Feast] as FeastDetails | undefined) ?? feast.en
      ).name,
      kind: "Feast" as const,
      path: `${RECIPES_PATH}/feasts/${feast.id}`,
      source: feast,
    })),
    ...recipes.map((recipe) => ({
      id: `recipe-${recipe.id}`,
      label: (
        (recipe[language as keyof Recipe] as RecipeDetails | undefined) ??
        recipe.en
      ).name,
      kind: "Recipe" as const,
      path: `${RECIPES_PATH}/${recipe.category}/${recipe.id}`,
      source: recipe,
    })),
  ];

  const openTranslation = (row: CoverageRow, code: LanguagesAvailable) => {
    setLanguage(code);
    navigate(`${row.path}?${LANGUAGE_QUERY_PARAM}=${code}`);
  };

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">{t("translationCoverage")}</h2>
        <p className="mt-1 text-sm text-stone-500">{t("translationCoverageDescription")}</p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="sticky top-16 left-0 z-30 w-44 max-w-44 bg-stone-50 px-3 py-3 text-left font-semibold text-stone-700 md:top-28">
                {t("feastOrRecipe")}
              </th>
              {languages.map((item) => (
                <th
                  key={item.code}
                  className={`sticky top-16 z-20 min-w-10 px-1 py-3 text-center transition-colors md:top-28 ${
                    hoveredCell?.column === item.code
                      ? "bg-amber-100 text-amber-900"
                      : "bg-stone-50 text-stone-700"
                  }`}
                  title={item.name}
                >
                  <img
                    className="mx-auto h-5 w-5 rounded-full border border-stone-200 object-cover"
                    src={`/flags/${item.countryCode}.svg`}
                    alt={item.name}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowIsHovered = hoveredCell?.row === row.id;

              return (
                <tr
                  key={row.id}
                  className="border-b border-stone-100 last:border-0"
                >
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 w-44 max-w-44 px-3 py-2.5 text-left transition-colors ${
                      rowIsHovered ? "bg-amber-100" : "bg-white"
                    }`}
                  >
                    <div className="flex min-w-0 flex-col items-start gap-1">
                      <span className="w-full break-words whitespace-normal font-medium text-stone-800">
                        {row.label}
                      </span>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                        {row.kind}
                      </span>
                    </div>
                  </th>
                  {languages.map((item) => {
                    const translated = hasTranslation(row.source, item.code);

                    return (
                      <td
                        key={item.code}
                        className="relative p-0"
                      >
                        <button
                          type="button"
                          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-all hover:brightness-95 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500 ${
                            translated
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-600"
                          }`}
                          aria-label={`${row.label}: ${
                            translated ? "translated" : "not translated"
                          } in ${item.name}`}
                          title={`${row.label} — ${item.name}`}
                          onMouseEnter={() =>
                            setHoveredCell({ row: row.id, column: item.code })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                          onFocus={() =>
                            setHoveredCell({ row: row.id, column: item.code })
                          }
                          onBlur={() => setHoveredCell(null)}
                          onClick={() => openTranslation(row, item.code)}
                        >
                          {translated ? (
                            <LuCheck
                              aria-hidden="true"
                              size="18"
                              strokeWidth="2.5"
                            />
                          ) : (
                            <LuX
                              aria-hidden="true"
                              size="18"
                              strokeWidth="2.5"
                            />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TranslationCoverageTable;
