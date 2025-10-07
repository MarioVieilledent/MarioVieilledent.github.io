import { RECIPES_PATH } from "../utils/routes";
import { useTranslation } from "../utils/TranslationContext";
import type { Recipe, RecipeDetails } from "../utils/validator";
import NavigateTo from "./NavigateTo";

const RecipeDisplay = ({ recipe }: { recipe: Recipe }) => {
  const { language } = useTranslation();
  const { t } = useTranslation();

  const details = recipe[language as keyof Recipe]
    ? (recipe[language as keyof Recipe] as RecipeDetails)
    : recipe.en;

  return (
    <div className="flex flex-col gap-4 w-full">
      <NavigateTo location={`${RECIPES_PATH}/${recipe.category}`} />
      {recipe.pictures.length > 0 ? (
        <img
          src={`/food/${recipe.pictures[0]}`}
          alt="Feast picture"
          className="w-full"
        />
      ) : (
        <img
          src="/noPicturePlaceholder.png"
          alt="No picture placeholder"
          className="w-32 h-32 self-center"
        />
      )}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="text-2xl">{details.name}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-md text-gray-600">{details.notes}</div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-xl">{t("ingredients")}</div>
          {typeof details.ingredients[0] === "string" ? (
            <div className="flex items-center gap-4 text-md whitespace-pre-line text-ellipsis overflow-hidden text-start line-clamp-1">
              {(details.ingredients as string[])
                .map((str) => `\t- ${str}`)
                .join("\n")}
            </div>
          ) : (
            (
              details.ingredients as { part: string; ingredients: string[] }[]
            ).map((part) => (
              <div key={part.part}>
                <div className="text-md text-gray-600">{part.part}</div>
                <div className="flex items-center gap-4 text-md whitespace-pre-line text-ellipsis overflow-hidden text-start line-clamp-1">
                  {part.ingredients.map((str) => `\t- ${str}`).join("\n")}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-xl">{t("instructions")}</div>
          {typeof details.instructions[0] === "string" ? (
            <div className="flex items-center gap-4 text-md whitespace-pre-line text-ellipsis overflow-hidden text-start line-clamp-1">
              {(details.instructions as string[])
                .map((str) => `\t- ${str}`)
                .join("\n")}
            </div>
          ) : (
            (
              details.instructions as { part: string; instructions: string[] }[]
            ).map((part) => (
              <div key={part.part}>
                <div className="text-md text-gray-600">{part.part}</div>
                <div className="flex items-center gap-4 text-md whitespace-pre-line text-ellipsis overflow-hidden text-start line-clamp-1">
                  {part.instructions.map((str) => `\t- ${str}`).join("\n")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;
