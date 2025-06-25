import { useState } from "react";
import {
  useTranslation,
  type LanguagesAvailable,
} from "../utils/TranslationContext";
import { languages } from "../utils/constants";
import { TranslateIcon } from "@phosphor-icons/react";

const LanguageSelection = () => {
  const { language, setLanguage } = useTranslation();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(language);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <TranslateIcon size="24" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 overflow-auto rounded border border-gray-300 bg-white shadow-lg"
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === selected}
              onClick={() => {
                setLanguage(lang.code as LanguagesAvailable);
                setSelected(lang.code);
                setOpen(false);
              }}
              className={`cursor-pointer px-3 py-2 flex items-center gap-2 ${
                lang.code === selected ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <img
                className="w-4"
                src={`/${lang.code}.png`}
                alt={`Language icon ${lang.code}`}
              />{" "}
              {lang.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelection;
