import { useNavigate } from "react-router";
import { useIsMobile } from "../utils/isMobileHook";
import { useTranslation } from "../utils/TranslationContext";
import { RECIPES_PATH } from "../utils/routes";
import type { Recipe, RecipeDetails } from "../utils/validator";

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const { language } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const details = recipe[language as keyof Recipe]
    ? (recipe[language as keyof Recipe] as RecipeDetails)
    : recipe.en;

  return (
    <div className={isMobile ? "flex flex-col gap-4" : "flex gap-4 w-full"}>
      {recipe.pictures.length > 0 ? (
        <img
          src={`/food/${recipe.pictures[0]}`}
          alt="Feast picture"
          className={isMobile ? "w-full" : "w-64 h-64 min-w-64 object-cover"}
        />
      ) : (
        <img
          src="/noPicturePlaceholder.png"
          alt="No picture placeholder"
          className="w-64 h-64 self-center"
        />
      )}
      <div className="flex flex-col gap-2 p-4">
        <div
          className="flex items-center gap-4 cursor-pointer hover:underline"
          onClick={() =>
            navigate(`${RECIPES_PATH}/${recipe.category}/${recipe.id}`)
          }
        >
          <div className="text-lg">{details.name}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">{details.notes}</div>
        </div>

        {typeof details.ingredients[0] === "string" ? (
          <div className="flex items-center gap-4 text-sm whitespace-pre-line text-ellipsis overflow-hidden text-start line-clamp-1">
            {(details.ingredients as string[])
              .map((str) => `\t- ${str}`)
              .join("\n")}
          </div>
        ) : (
          (
            details.ingredients as { part: string; ingredients: string[] }[]
          ).map((part) => (
            <div key={part.part}>
              <div className="text-sm text-gray-600">{part.part}</div>
              <div className="flex items-center gap-4 text-sm whitespace-pre-line text-ellipsis overflow-hidden text-start line-clamp-1">
                {part.ingredients.map((str) => `\t- ${str}`).join("\n")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
