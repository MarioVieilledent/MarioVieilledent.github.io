import { useTranslation } from "../utils/TranslationContext";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router";

const NavigateTo = ({ location }: { location?: string }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <a
      className="flex cursor-pointer items-center gap-1 rounded-full py-1.5 pr-3 pl-1.5 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
      onClick={() => {
        if (location !== undefined) {
          navigate(location);
        } else {
          navigate(-1);
        }
      }}
    >
      <LuChevronLeft size="20" />
      {t("back")}
    </a>
  );
};

export default NavigateTo;
