import Home from "../components/Home";
import { useTranslation } from "../utils/TranslationContext";
import notFoundImage from "/404.png";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-center">{t("pageNotFound")}</h1>

      <Home />

      <img
        src={notFoundImage}
        alt="404 Not Found"
        className="w-1/2 max-w-sm mt-10"
      />
    </div>
  );
};

export default NotFound;
