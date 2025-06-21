import { useTranslation } from "../components/translations";

const Home = () => {
  const { t } = useTranslation();

  return <>{t("title")}</>;
};
export default Home;
