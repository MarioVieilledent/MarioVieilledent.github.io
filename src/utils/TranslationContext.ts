import { createContext, useContext } from "react";
import { translations } from "../translations";
import { languages } from "../types/constants";

export type LanguagesAvailable = "en" | "nb" | "fr";

export type TermKeys = keyof typeof translations;

type TranslationContextType = {
  language: LanguagesAvailable;
  setLanguage: (langCode: LanguagesAvailable) => void;
};

export const TranslationContext = createContext<
  TranslationContextType | undefined
>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context)
    throw new Error("useTranslation must be used within a TranslationProvider");

  const { language, setLanguage } = context;

  const t = (key: TermKeys) =>
    translations[key][
      languages.find((ln) => ln.code === language)?.index ?? 0
    ] ?? key;

  return { t, language, setLanguage };
};
