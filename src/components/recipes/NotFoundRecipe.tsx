import { RECIPES_PATH } from "../../utils/routes";
import { useTranslation } from "../../utils/TranslationContext";
import NavigateTo from "../NavigateTo";
import notFoundImage from "/404.png";

const NotFoundRecipe = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center">
      <img src={notFoundImage} alt="404 Not Found" className="w-1/2 max-w-xs" />
      <h1 className="text-2xl font-bold text-stone-900">
        {t("pageNotFound")}
      </h1>
      <NavigateTo location={`${RECIPES_PATH}`} />
    </div>
  );
};

export default NotFoundRecipe;
