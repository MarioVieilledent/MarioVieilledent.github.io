import { RECIPES_PATH } from "../../utils/routes";
import { useTranslation } from "../../utils/TranslationContext";
import NavigateTo from "../NavigateTo";
import notFoundImage from "/404.png";

const NotFoundRecipe = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-center">{t("pageNotFound")}</h1>

      <NavigateTo location={`${RECIPES_PATH}`} />

      <img
        src={notFoundImage}
        alt="404 Not Found"
        className="w-1/2 max-w-sm mt-10"
      />
    </div>
  );
};

export default NotFoundRecipe;
