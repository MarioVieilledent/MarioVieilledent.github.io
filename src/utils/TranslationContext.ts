import { createContext, useContext } from "react";
import { translations } from "./translations";

export type LanguagesAvailable =
  | "ar" // Arabic
  | "de" // German
  | "el" // Greek
  | "en" // English
  | "es" // Spanish
  | "fr" // French
  | "it" // Italian
  | "ja" // Japanese
  | "nb" // Norwegian
  | "sl" // Slovenian
  | "tr" // Turkish
  | "zh"; // Chinese

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
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }

  const { language, setLanguage } = context;

  const t = (key: TermKeys) => translations[key][language] ?? key;

  return { t, language, setLanguage };
};

export const languages: {
  code: LanguagesAvailable;
  countryCode: string;
  name: string;
}[] = [
  {
    code: "ar",
    countryCode: "sa",
    name: "العربية",
  },
  {
    code: "de",
    countryCode: "de",
    name: "Deutsch",
  },
  {
    code: "el",
    countryCode: "gr",
    name: "Ελληνικά",
  },
  {
    code: "en",
    countryCode: "gb",
    name: "English",
  },
  {
    code: "es",
    countryCode: "es",
    name: "Español",
  },
  {
    code: "fr",
    countryCode: "fr",
    name: "Français",
  },
  {
    code: "it",
    countryCode: "it",
    name: "Italiano",
  },
  {
    code: "ja",
    countryCode: "jp",
    name: "日本語",
  },
  {
    code: "nb",
    countryCode: "no",
    name: "Norsk",
  },
  {
    code: "sl",
    countryCode: "si",
    name: "Slovenščina",
  },
  {
    code: "tr",
    countryCode: "tr",
    name: "Türk",
  },
  {
    code: "zh",
    countryCode: "cn",
    name: "中文",
  },
];

export const isLanguageAvailable = (
  value: string,
): value is LanguagesAvailable =>
  languages.some((language) => language.code === value);
