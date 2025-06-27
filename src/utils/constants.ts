import type { LanguagesAvailable } from "./TranslationContext";

export const LOCAL_STORAGE_ROUTE_KEY = "route";
export const LOCAL_STORAGE_LANGUAGE_KEY = "language";
export const LOCAL_STORAGE_LAYERS_KEY = "layer";
export const LOCAL_STORAGE_CENTER_KEY = "center";
export const LOCAL_STORAGE_RESOLUTION_KEY = "resolution";

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
