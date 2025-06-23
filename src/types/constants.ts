import type { LanguagesAvailable } from "../utils/TranslationContext";

export const LOCAL_STORAGE_LANGUAGE_KEY = "language";

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
