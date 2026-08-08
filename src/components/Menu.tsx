import LanguageSelection from "./LanguageSelection";
import { useTranslation } from "../utils/TranslationContext";
import websiteLogo from "/favicon.png";
import {
  LuBook,
  LuGithub,
  LuMenu,
  LuNotebookText,
  LuSchool,
  LuBrain,
  LuFlag,
} from "react-icons/lu";
import Float from "./Float";
import { Link } from "react-router";
import { useIsMobile } from "../utils/isMobileHook";
import { FLOATING_BUTTON_BASE } from "../utils/constants";

const linkClassName =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900";

const Menu = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Float
      Icon={LuMenu}
      buttonClassName={`fixed top-4 left-4 z-50 ${FLOATING_BUTTON_BASE}`}
      containerClassName="fixed top-20 left-4 z-40 w-[calc(100%-2rem)] max-w-128 rounded-3xl border border-stone-200 bg-white flex flex-col justify-start gap-6 shadow-xl p-6"
    >
      <div className="flex items-center gap-4">
        <img
          className={isMobile ? "w-16" : "w-20"}
          src={websiteLogo}
          alt="Website logo"
        />
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-stone-900">{t("title")}</h1>
          <span className="text-sm text-stone-500">
            {t("websiteDescription")}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 border-t border-stone-100 pt-2">
        <LanguageSelection />
        <Link to="recipes" className={linkClassName}>
          <LuNotebookText size="20" />
          {t("recipes")}
        </Link>
        <Link to="learnNorwegian" className={linkClassName}>
          <LuSchool size="20" />
          {t("learnNorwegian")}
        </Link>
        <Link to="turkishFlashcards" className={linkClassName}>
          <LuBrain size="20" />
          {t("turkishFlashcards")}
        </Link>
        <Link to="flags" className={linkClassName}>
          <LuFlag size="20" />
          {t("flags")}
        </Link>
        <a
          className={linkClassName}
          href="https://github.com/MarioVieilledent/MarioVieilledent.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LuGithub size="20" />
          GitHub
        </a>
        <a
          className={linkClassName}
          href="Industrial_Society_and_Its_Future.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LuBook size="20" />
          Industrial Society and Its Future
        </a>
      </div>
    </Float>
  );
};

export default Menu;
