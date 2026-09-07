import { useEffect, useRef, useState } from "react";
import { languages, useTranslation } from "../utils/TranslationContext";
import { LuCheck, LuChevronDown, LuLanguages } from "react-icons/lu";
import LanguageOptionButton from "./LanguageOptionButton";

type LanguageSelectionProps = {
  className?: string;
  dropUp?: boolean;
};

const LanguageSelection = ({
  className = "",
  dropUp = false,
}: LanguageSelectionProps) => {
  const { t, language, setLanguage } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLanguage = languages.find((item) => item.code === language)!;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        className="flex h-10 w-full items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-100 hover:text-stone-950"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t("language")}: ${selectedLanguage.name}`}
      >
        <LuLanguages
          size="18"
          className="shrink-0 text-stone-500"
          aria-hidden="true"
        />
        <img
          className="h-4 w-6 shrink-0 rounded-sm object-cover"
          src={`/flags/${selectedLanguage.countryCode}.svg`}
          alt=""
        />
        <span
          className="min-w-0 grow truncate text-start"
          lang={selectedLanguage.code}
        >
          {selectedLanguage.name}
        </span>
        <LuChevronDown
          size="16"
          aria-hidden="true"
          className={`shrink-0 text-stone-400 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language")}
          className={`absolute end-0 z-50 max-h-[min(60dvh,26rem)] w-64 origin-top-right animate-[float-in_150ms_ease-out] overflow-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl rtl:origin-top-left ${
            dropUp
              ? "bottom-full mb-2 origin-bottom-right rtl:origin-bottom-left"
              : "mt-2"
          }`}
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              role="none"
            >
              <LanguageOptionButton
                option={lang}
                active={lang.code === language}
                className="w-full"
                role="option"
                aria-selected={lang.code === language}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
              >
                {lang.code === language && (
                  <LuCheck className="ms-auto shrink-0" aria-hidden="true" />
                )}
              </LanguageOptionButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelection;
