import { useState } from "react";
import { languages, useTranslation } from "../utils/TranslationContext";
import { LuChevronDown, LuLanguages } from "react-icons/lu";
import LanguageOptionButton from "./LanguageOptionButton";

const LanguageSelection = () => {
  const { t, language, setLanguage } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex cursor-pointer items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <LuLanguages size="20" />
        <span>{t("language")}</span>
        <LuChevronDown
          size="16"
          className={`text-stone-400 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 min-w-44 max-h-120 origin-top-left animate-[float-in_150ms_ease-out] overflow-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-lg"
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === language}
            >
              <LanguageOptionButton
                option={lang}
                active={lang.code === language}
                className="w-full"
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelection;
