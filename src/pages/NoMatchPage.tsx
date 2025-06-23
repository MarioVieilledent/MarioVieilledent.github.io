import Section from "../components/Section";
import { useTranslation } from "../utils/TranslationContext";

const NoMatchPage = () => {
  const { t } = useTranslation();

  return (
    <Section style="bg-sky-300">
      <div>{t("noMatch")}</div>
    </Section>
  );
};

export default NoMatchPage;
