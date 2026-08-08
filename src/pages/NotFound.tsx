import Home from "../components/Home";
import { useTranslation } from "../utils/TranslationContext";
import notFoundImage from "/404.png";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-stone-50 p-4 text-center">
      <img src={notFoundImage} alt="404 Not Found" className="w-1/2 max-w-xs" />
      <h1 className="text-2xl font-bold text-stone-900">
        {t("pageNotFound")}
      </h1>
      <Home />
    </div>
  );
};

export default NotFound;
