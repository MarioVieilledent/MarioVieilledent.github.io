import { useEffect, useState, type ReactNode } from "react";
import {
  LANGUAGE_QUERY_PARAM,
  LOCAL_STORAGE_LANGUAGE_KEY,
} from "../utils/constants";
import {
  TranslationContext,
  isLanguageAvailable,
  type LanguagesAvailable,
} from "../utils/TranslationContext";
import { getURLParam, setURLParam } from "../utils/urlSync";

const DEFAULT_LANGUAGE: LanguagesAvailable = "en";

// Priority: URL param > localStorage > default. Whichever one wins is then
// written back to the other by the effect below, keeping them in sync.
const getInitialLanguage = (): LanguagesAvailable => {
  const fromURL = getURLParam(LANGUAGE_QUERY_PARAM);
  if (fromURL && isLanguageAvailable(fromURL)) return fromURL;

  const fromStorage = window.localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY);
  if (fromStorage && isLanguageAvailable(fromStorage)) return fromStorage;

  return DEFAULT_LANGUAGE;
};

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguagesAvailable>(
    getInitialLanguage,
  );

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);
    setURLParam(LANGUAGE_QUERY_PARAM, language);
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};
