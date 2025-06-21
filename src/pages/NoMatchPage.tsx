import Section from "../components/Section";
import { useTranslation } from "../components/translations";

const NoMatchPage = () => {
  const { t } = useTranslation();

  return (
    <Section style="bg-sky-300">
      <div>{t("noMatch")}</div>
    </Section>
  );
};

export default NoMatchPage;
