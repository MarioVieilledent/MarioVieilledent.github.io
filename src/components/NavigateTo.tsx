import { useTranslation } from "../utils/TranslationContext";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router";

const NavigateTo = ({ location }: { location?: string }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <a
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => {
        if (location !== undefined) {
          navigate(location);
        } else {
          navigate(-1);
        }
      }}
    >
      <LuChevronLeft size="24" />
      {t("back")}
    </a>
  );
};

export default NavigateTo;
