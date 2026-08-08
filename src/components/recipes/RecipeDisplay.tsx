import { useIsMobile } from "../../utils/isMobileHook";
import { useTranslation } from "../../utils/TranslationContext";
import { RECIPES_PATH } from "../../utils/routes";
import type { Recipe, RecipeDetails } from "../../utils/validator";
import BulletList from "./BulletList";
import NavigateTo from "../NavigateTo";

const RecipeDisplay = ({ recipe }: { recipe: Recipe }) => {
  const { language, t } = useTranslation();
  const isMobile = useIsMobile();

  const details = recipe[language as keyof Recipe]
    ? (recipe[language as keyof Recipe] as RecipeDetails)
    : recipe.en;

  const ingredients =
    typeof details.ingredients[0] === "string"
      ? (details.ingredients as string[])
      : (
          details.ingredients as { part: string; ingredients: string[] }[]
        ).map((group) => ({ part: group.part, items: group.ingredients }));

  const instructions =
    typeof details.instructions[0] === "string"
      ? (details.instructions as string[])
      : (
          details.instructions as { part: string; instructions: string[] }[]
        ).map((group) => ({ part: group.part, items: group.instructions }));

  const [heroPicture, ...galleryPictures] = recipe.pictures;

  return (
    <div className="flex flex-col gap-8">
      {heroPicture ? (
        <img
          src={`/food/${heroPicture}`}
          alt={details.name}
          className={`w-full object-cover ${
            isMobile ? "aspect-[4/3]" : "aspect-[21/9] rounded-3xl"
          }`}
        />
      ) : (
        <img
          src="/noPicturePlaceholder.png"
          alt="No picture placeholder"
          className="mx-auto w-32"
        />
      )}

      <div
        className={
          isMobile ? "flex flex-col gap-8 px-4 pb-8" : "flex flex-col gap-8 pb-8"
        }
      >
        <NavigateTo location={`${RECIPES_PATH}/${recipe.category}`} />

        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-5xl">
            {details.name}
          </h1>
          {details.notes && (
            <p className="mt-3 text-stone-500">{details.notes}</p>
          )}
        </div>

        <section className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-900">
            {t("ingredients")}
          </h2>
          <BulletList items={ingredients} />
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-900">
            {t("instructions")}
          </h2>
          <BulletList items={instructions} ordered />
        </section>

        {galleryPictures.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-stone-900">
              {t("pictures")}
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {galleryPictures.map((picture, index) => (
                <img
                  key={index}
                  src={`/food/${picture}`}
                  alt={`${details.name} ${index + 2}`}
                  className="aspect-square w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default RecipeDisplay;
