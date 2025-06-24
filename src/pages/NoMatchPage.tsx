import { useTranslation } from "../utils/TranslationContext";

const NoMatchPage = () => {
  const { t } = useTranslation();

  return <div>{t("noMatch")}</div>;
};

export default NoMatchPage;
