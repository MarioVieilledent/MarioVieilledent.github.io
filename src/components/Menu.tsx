import duckLogo from "/favicon.png";
import LanguageSelection from "./LanguageSelection";
import { useTranslation } from "../utils/TranslationContext";
import { LuMenu } from "react-icons/lu";
import Float from "./Float";

const Menu = () => {
  const { t } = useTranslation();

  return (
    <Float
      Icon={LuMenu}
      buttonClassName="fixed top-4 left-4 z-50 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition"
      containerClassName="fixed top-20 left-4 z-40 w-[calc(100%-2rem)] max-w-128 rounded-3xl bg-white flex flex-col justify-start gap-4 shadow-xl p-4 transition-all"
    >
      <div className="flex items-center gap-4">
        <img className="w-8 h-8" src={duckLogo} alt="Duck logo" />
        <h1>{t("title")}</h1>
      </div>
      <span>{t("websiteDescription")}</span>
      <LanguageSelection />
    </Float>
  );
};

export default Menu;
