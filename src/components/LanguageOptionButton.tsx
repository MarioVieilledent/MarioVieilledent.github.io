import type { ButtonHTMLAttributes } from "react";
import type { LanguagesAvailable } from "../utils/TranslationContext";

interface LanguageOption {
  code: LanguagesAvailable;
  countryCode: string;
  name: string;
}

interface LanguageOptionButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  active?: boolean;
  option: LanguageOption;
}

const LanguageOptionButton = ({
  active = false,
  className = "",
  option,
  ...buttonProps
}: LanguageOptionButtonProps) => (
  <button
    type="button"
    className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm whitespace-nowrap transition-colors ${
      active
        ? "bg-amber-50 font-semibold text-amber-700"
        : "text-stone-700 hover:bg-stone-100"
    } ${className}`}
    {...buttonProps}
  >
    <img
      className="w-6 rounded-sm"
      src={`/flags/${option.countryCode}.svg`}
      alt=""
    />
    <span>{option.name}</span>
  </button>
);

export default LanguageOptionButton;
