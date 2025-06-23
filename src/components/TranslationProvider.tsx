import { useEffect, useState, type ReactNode } from "react";
import { LOCAL_STORAGE_LANGUAGE_KEY } from "../types/constants";
import {
  TranslationContext,
  type LanguagesAvailable,
} from "../utils/TranslationContext";

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguagesAvailable>(
    (window.localStorage.getItem(
      LOCAL_STORAGE_LANGUAGE_KEY
    ) as LanguagesAvailable) ?? "en"
  );

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};
