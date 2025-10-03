import LanguageSelection from "./LanguageSelection";
import { useTranslation } from "../utils/TranslationContext";
import websiteLogo from "/favicon.png";
import {
  LuBook,
  LuGithub,
  LuMenu,
  LuNotebookText,
  LuSchool,
} from "react-icons/lu";
import Float from "./Float";
import { useNavigate } from "react-router";

const Menu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Float
      Icon={LuMenu}
      buttonClassName="fixed top-4 left-4 z-50 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition"
      containerClassName="fixed top-20 left-4 z-40 w-[calc(100%-2rem)] max-w-128 rounded-3xl bg-white flex flex-col justify-start gap-8 shadow-xl p-4 transition-all"
    >
      <div className="flex items-center gap-4">
        <img className="w-32 h-32" src={websiteLogo} alt="Website logo" />
        <h1>{t("title")}</h1>
      </div>
      <span>{t("websiteDescription")}</span>
      <div className="flex flex-col gap-4">
        <LanguageSelection />
        <a
          className="flex items-center gap-2 cursor-pointer"
          href="https://github.com/MarioVieilledent/MarioVieilledent.github.io"
          target="_blank"
        >
          <LuGithub size="24" />
          GitHub
        </a>
        <a
          className="flex items-center gap-2 cursor-pointer"
          href="Industrial_Society_and_Its_Future.html"
          target="_blank"
        >
          <LuBook size="24" />
          Industrial Society and Its Future
        </a>
        <a
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("recipes")}
        >
          <LuNotebookText size="24" />
          {t("recipes")}
        </a>
        <a
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("learn")}
        >
          <LuSchool size="24" />
          {t("learnNorwegian")}
        </a>
      </div>
    </Float>
  );
};

export default Menu;
