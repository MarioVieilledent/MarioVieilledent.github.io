import duckLogo from "/favicon.png";
import LanguageSelection from "./LanguageSelection";
import { useTranslation } from "../utils/TranslationContext";
import { LuBook, LuGithub, LuMenu } from "react-icons/lu";
import Float from "./Float";
import { useNavigate } from "react-router";

const Menu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      <a
        className="flex items-center gap-2"
        href="https://github.com/MarioVieilledent/MarioVieilledent.github.io"
        target="_blank"
      >
        <LuGithub size="24" />
        GitHub
      </a>
      <a
        className="flex items-center gap-2"
        href="Industrial_Society_and_Its_Future.html"
        target="_blank"
      >
        <LuBook size="24" />
        Industrial Society and Its Future
      </a>
      <span
        className="flex items-center gap-2"
        onClick={() => navigate("learn")}
      >
        <LuBook size="24" />
        Lære Norsk
      </span>
    </Float>
  );
};

export default Menu;
