import { useState } from "react";
import {
  languages,
  useTranslation,
  type LanguagesAvailable,
} from "../utils/TranslationContext";
import { LuLanguages } from "react-icons/lu";

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
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 max-h-120 origin-top-left animate-[float-in_150ms_ease-out] overflow-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-lg"
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === language}
              onClick={() => {
                setLanguage(lang.code as LanguagesAvailable);
                setOpen(false);
              }}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                lang.code === language
                  ? "bg-amber-50 font-semibold text-amber-700"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <img
                className="w-6 rounded-sm"
                src={`/flags/${lang.countryCode}.svg`}
                alt={`Language icon ${lang.code}`}
              />
              {lang.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelection;
