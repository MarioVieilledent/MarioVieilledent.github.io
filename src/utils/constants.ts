import type { LanguagesAvailable } from "./TranslationContext";

export const LOCAL_STORAGE_ROUTE_KEY = "route";
export const LOCAL_STORAGE_LANGUAGE_KEY = "language";
export const LOCAL_STORAGE_LAYERS_KEY = "layer";
export const LOCAL_STORAGE_CENTER_KEY = "center";
export const LOCAL_STORAGE_RESOLUTION_KEY = "resolution";

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
    code: "nb",
    countryCode: "no",
    name: "Norsk",
    index: 1,
  },
  {
    code: "fr",
    countryCode: "fr",
    name: "Français",
    index: 2,
  },
  {
    code: "it",
    countryCode: "it",
    name: "Italiano",
    index: 3,
  },
];
