import { useCallback, useState } from "react";
import { terms } from "../terms";

type LanguagesAvailable = "en" | "nb" | "fr";

export const languages: {
  code: LanguagesAvailable;
  name: string;
  index: number;
}[] = [
  {
    code: "en",
    name: "English",
    index: 0,
  },
  {
    code: "nb",
    name: "Norsk",
    index: 1,
  },
  {
    code: "fr",
    name: "Français",
    index: 2,
  },
];

export type termKeys = keyof typeof terms;

export const useTranslation = () => {
  const [languageIndex, setLanguageIndex] = useState(0);

  const t = (key: termKeys): string => terms[key][languageIndex];

  const setLanguage = useCallback(
    (languageCode: LanguagesAvailable) =>
      setLanguageIndex(languages.findIndex((ln) => ln.code === languageCode)),
    []
  );

  return { t, setLanguage };
};
