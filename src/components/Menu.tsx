import { useState, type ReactNode } from "react";
import duckLogo from "/favicon.png";
import LanguageSelection from "./LanguageSelection";
import { useTranslation, type TermKeys } from "../utils/TranslationContext";
import { LuMenu } from "react-icons/lu";

interface MenuProps {
  pages: { name: TermKeys; component: ReactNode }[];
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
}

const Menu = ({ pages, route, setRoute }: MenuProps) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition"
      >
        <LuMenu className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed top-20 left-4 z-40 w-[calc(100%-2rem)] max-w-128 rounded-3xl bg-white flex flex-col gap-4 shadow-xl p-4 transition-all">
          {false ? (
            <>
              <div className="flex justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img className="w-8 h-8" src={duckLogo} alt="Duck logo" />
                  <h1>{t("title")}</h1>
                </div>
                <LanguageSelection />
              </div>

              <div className="flex flex-col items-start gap-4">
                {pages.map((page) => (
                  <button
                    className={`px-2 ${
                      route === page.name
                        ? `border-l-4 border-black`
                        : `border-l-4 border-transparent`
                    }`}
                    key={page.name}
                    onClick={() => setRoute(page.name)}
                  >
                    {t(page.name)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>Nothing here</>
          )}
        </div>
      )}
    </>
  );
};

export default Menu;
