import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  getLanguageDirection,
  type LanguagesAvailable,
} from "../utils/TranslationContext";

interface LanguageOption {
  code: LanguagesAvailable;
  countryCode: string;
  name: string;
}

interface LanguageOptionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children?: ReactNode;
  option: LanguageOption;
}

const LanguageOptionButton = ({
  active = false,
  className = "",
  children,
  option,
  ...buttonProps
}: LanguageOptionButtonProps) => (
  <button
    type="button"
    className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-base whitespace-nowrap transition-colors ${
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
    <span
      lang={option.code}
      dir={getLanguageDirection(option.code)}
    >
      {option.name}
    </span>
    {children}
  </button>
);

export default LanguageOptionButton;
