import { RECIPES_PATH } from "../../utils/routes";
import { useTranslation } from "../../utils/TranslationContext";
import NavigateTo from "../NavigateTo";

const NotFoundRecipe = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <NavigateTo location={`${RECIPES_PATH}`} />
      <h1 className="text-4xl font-bold text-center mt-20">
        {t("pageNotFound")}
      </h1>

      <img
        src="/public/404.png"
        alt="404 Not Found"
        className="w-1/2 max-w-sm mt-10"
      />
    </div>
  );
};

export default NotFoundRecipe;
