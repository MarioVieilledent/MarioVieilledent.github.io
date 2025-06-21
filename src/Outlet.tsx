import type { ReactNode } from "react";
import { languages, useTranslation } from "./components/translations";
import duckLogo from "/favicon.png";
import Button from "./components/Button";
import Section from "./components/Section";
import { pages } from "./App";

interface OutletProps {
  children: ReactNode;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
}

const Outlet = ({ children, setRoute }: OutletProps) => {
  const { t, setLanguage } = useTranslation();
  return (
    <div className="w-full h-full">
      <Section style="bg-sky-300">
        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-4">
            <img className="w-8 h-8" src={duckLogo} alt="Duck logo" />
            <h1>{t("title")}</h1>
          </div>
          <div className="flex items-center gap-4">
            {pages.map((page) => (
              <Button key={page.name} onClick={() => setRoute(page.name)}>
                {t(page.name)}
              </Button>
            ))}
          </div>
          <select name="languages">
            {languages.map((lang) => (
              <option value={lang.code} onClick={() => setLanguage(lang.code)}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </Section>
      <Section>{children}</Section>
    </div>
  );
};

export default Outlet;
