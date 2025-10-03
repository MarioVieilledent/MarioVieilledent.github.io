import { useTranslation } from "../utils/TranslationContext";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router";

const GoBackHome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <a
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <LuChevronLeft size="24" />
      {t("goBackHome")}
    </a>
  );
};

export default GoBackHome;
