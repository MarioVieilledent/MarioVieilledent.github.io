import { createContext, useContext } from "react";
import { translations } from "./translations";

export type LanguagesAvailable = "en" | "fr" | "it" | "es" | "nb" | "ja" | "zh";

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

  const t = (key: TermKeys) =>
    translations[key][
      languages.find((ln) => ln.code === language)?.index ?? 0
    ] ?? key;

  return { t, language, setLanguage };
};

export const languages: {
  code: LanguagesAvailable;
  countryCode: string;
  name: string;
  index: number;
}[] = [
  {
    code: "en",
    countryCode: "gb",
    name: "English",
    index: 0,
  },
  {
    code: "fr",
    countryCode: "fr",
    name: "Français",
    index: 1,
  },
  {
    code: "it",
    countryCode: "it",
    name: "Italiano",
    index: 2,
  },
  {
    code: "es",
    countryCode: "es",
    name: "Español",
    index: 3,
  },
  {
    code: "nb",
    countryCode: "no",
    name: "Norsk",
    index: 4,
  },
  {
    code: "ja",
    countryCode: "jp",
    name: "日本語",
    index: 5,
  },
  {
    code: "zh",
    countryCode: "cn",
    name: "中文",
    index: 6,
  },
];
