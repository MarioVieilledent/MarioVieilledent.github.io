import { useNavigate } from "react-router";
import { useTranslation } from "../../utils/TranslationContext";
import { RECIPES_PATH } from "../../utils/routes";
import type { Recipe, RecipeDetails } from "../../utils/validator";
import type { Dispatch, SetStateAction } from "react";
import BulletList from "./BulletList";

interface RecipeCardProps {
  recipe: Recipe;
  setSearch?: Dispatch<SetStateAction<string>>;
}

const RecipeCard = ({ recipe, setSearch }: RecipeCardProps) => {
  const { language } = useTranslation();
  const navigate = useNavigate();

  const details = recipe[language as keyof Recipe]
    ? (recipe[language as keyof Recipe] as RecipeDetails)
    : recipe.en;

  const ingredients =
    typeof details.ingredients[0] === "string"
      ? (details.ingredients as string[])
      : (
          details.ingredients as { part: string; ingredients: string[] }[]
        ).map((group) => ({ part: group.part, items: group.ingredients }));

  return (
    <div
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      onClick={() => {
        navigate(`${RECIPES_PATH}/${recipe.category}/${recipe.id}`);
        if (setSearch) {
          setSearch("");
        }
      }}
    >
      {recipe.pictures.length > 0 ? (
        <img
          src={`/food/${recipe.pictures[0]}`}
          alt={details.name}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <img
          src="/noPicturePlaceholder.png"
          alt="No picture placeholder"
          className="aspect-[4/3] w-full object-contain bg-stone-50 p-8"
        />
      )}
      <div className="flex grow flex-col gap-2 p-5">
        <div className="text-lg font-semibold text-stone-900">
          {details.name}
        </div>
        {details.notes && (
          <div className="text-sm text-stone-500">{details.notes}</div>
        )}

        <div className="mt-1">
          <BulletList items={ingredients} maxItems={4} />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
