import { type ReactNode } from "react";
import duckLogo from "/favicon.png";
import Button from "./components/Button";
import Section from "./components/Section";
import { useTranslation, type TermKeys } from "./utils/TranslationContext";
import LanguageSelection from "./components/LanguageSelection";

interface OutletProps {
  pages: { name: TermKeys; component: ReactNode }[];
  children: ReactNode;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
}

const Outlet = ({ pages, children, setRoute }: OutletProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full h-full">
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
          <div className="flex items-center gap-4">
            <LanguageSelection />
          </div>
        </div>
      </Section>
      <div className="flex w-full grow overflow-y-auto ">{children}</div>
    </div>
  );
};

export default Outlet;
