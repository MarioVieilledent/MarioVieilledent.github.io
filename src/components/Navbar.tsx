import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  LuBook,
  LuBrain,
  LuChevronDown,
  LuEarth,
  LuEllipsis,
  LuGauge,
  LuGithub,
  LuMap,
  LuMenu,
  LuNotebookText,
  LuSchool,
  LuLanguages,
  LuX,
} from "react-icons/lu";
import { NavLink, useLocation } from "react-router";
import websiteLogo from "/favicon.png";
import { useTranslation, type TermKeys } from "../utils/TranslationContext";
import LanguageSelection from "./LanguageSelection";

type NavbarProps = {
  compact?: boolean;
  mapOverlay?: boolean;
};

type BrandProps = {
  compact?: boolean;
  rounded?: boolean;
};

type NavItem = {
  icon: ReactNode;
  label: TermKeys;
  englishLabel?: string;
  to: string;
};

const primaryNavItems: NavItem[] = [
  { icon: <LuMap aria-hidden="true" />, label: "map", to: "/" },
  {
    icon: <LuNotebookText aria-hidden="true" />,
    label: "recipes",
    to: "/recipes",
  },
  {
    icon: <LuEarth aria-hidden="true" />,
    label: "countries",
    to: "/countries",
  },
];

const moreNavItems: NavItem[] = [
  {
    icon: <LuLanguages aria-hidden="true" />,
    label: "more",
    englishLabel: "Arabic & Persian alphabet",
    to: "/arabic-alphabet",
  },
  {
    icon: <LuSchool aria-hidden="true" />,
    label: "learnNorwegian",
    to: "/learnNorwegian",
  },
  {
    icon: <LuBrain aria-hidden="true" />,
    label: "turkishFlashcards",
    to: "/turkishFlashcards",
  },
  {
    icon: <LuGauge aria-hidden="true" />,
    label: "more",
    englishLabel: "Running pace converter",
    to: "/pace-converter",
  },
];

const navItemClassName = (isActive = false) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
    isActive
      ? "bg-amber-50 text-amber-800"
      : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
  }`;

const InternalNavLink = ({
  item,
  onNavigate,
  role,
}: {
  item: NavItem;
  onNavigate?: () => void;
  role?: string;
}) => {
  const { t } = useTranslation();

  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) => navItemClassName(isActive)}
      onClick={onNavigate}
      role={role}
    >
      <span className="text-lg">{item.icon}</span>
      <span lang={item.englishLabel ? "en" : undefined} dir="ltr">
        {item.englishLabel ?? t(item.label)}
      </span>
    </NavLink>
  );
};

const MainNavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
  <>
    {primaryNavItems.map((item) => (
      <InternalNavLink key={item.to} item={item} onNavigate={onNavigate} />
    ))}
  </>
);

const ManifestoLink = ({ onNavigate }: { onNavigate?: () => void }) => (
  <a
    href="/Industrial_Society_and_Its_Future.html"
    target="_blank"
    rel="noopener noreferrer"
    className={navItemClassName()}
    lang="en"
    dir="ltr"
    role="menuitem"
    onClick={onNavigate}
  >
    <LuBook className="text-lg" aria-hidden="true" />
    Industrial Society and Its Future
  </a>
);

const MoreMenu = ({
  inline = false,
  onNavigate,
}: {
  inline?: boolean;
  onNavigate?: () => void;
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const isActive = moreNavItems.some((item) => pathname.startsWith(item.to));

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

  const closeMenu = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={`${navItemClassName(isActive)} w-full justify-between`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
      >
        <span className="flex items-center gap-2">
          <LuEllipsis className="text-lg" aria-hidden="true" />
          {t("more")}
        </span>
        <LuChevronDown
          size="15"
          className={`text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className={
            inline
              ? "ms-4 mt-1 flex flex-col gap-1 border-s border-stone-200 ps-2"
              : "absolute end-0 z-50 mt-2 flex w-72 origin-top-right animate-[float-in_150ms_ease-out] flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl rtl:origin-top-left"
          }
        >
          {moreNavItems.map((item) => (
            <InternalNavLink
              key={item.to}
              item={item}
              onNavigate={closeMenu}
              role="menuitem"
            />
          ))}
          <ManifestoLink onNavigate={closeMenu} />
        </div>
      )}
    </div>
  );
};

const GitHubLink = () => (
  <a
    href="https://github.com/MarioVieilledent/MarioVieilledent.github.io"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="View source on GitHub"
    title="GitHub"
    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-100 hover:text-stone-950"
  >
    <LuGithub size="21" aria-hidden="true" />
  </a>
);

const Brand = ({ compact = false, rounded = false }: BrandProps) => {
  const { t } = useTranslation();

  return (
    <NavLink
      to="/"
      end
      className={`flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600 ${
        compact ? "" : "grow sm:w-52 sm:shrink-0 sm:grow-0"
      }`}
    >
      <img
        className={`${compact ? "h-10 w-10" : "h-11 w-11"} shrink-0 ${
          rounded ? "rounded-xl" : ""
        }`}
        src={websiteLogo}
        alt=""
      />
      <div className="min-w-0">
        <div className="truncate text-base font-bold tracking-tight text-stone-950">
          {t("title")}
        </div>
        {compact && (
          <div className="truncate text-xs text-stone-500">
            Mario Vieilledent
          </div>
        )}
      </div>
    </NavLink>
  );
};

const Navbar = ({ compact = false, mapOverlay = false }: NavbarProps) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  if (compact) {
    return (
      <nav aria-label="Main navigation" className="flex flex-col gap-3">
        <Brand compact />
        <div className="h-px bg-stone-200" />
        <div className="flex max-h-[min(55dvh,28rem)] flex-col gap-1 overflow-y-auto">
          <MainNavLinks />
          <MoreMenu inline />
        </div>
        <div className="flex items-center gap-2 border-t border-stone-200 pt-3">
          <div className="min-w-0 grow">
            <LanguageSelection className="w-full" />
          </div>
          <GitHubLink />
        </div>
      </nav>
    );
  }

  if (mapOverlay) {
    return (
      <header className="pointer-events-none absolute inset-x-0 top-0 z-[70] p-4">
        <nav
          aria-label="Main navigation"
          className="relative mx-auto flex max-w-[90rem] items-start justify-between gap-4"
        >
          <div className="pointer-events-auto flex h-14 items-center rounded-2xl border border-white/70 bg-white/85 p-2 shadow-lg backdrop-blur-xl">
            <Brand rounded />
          </div>

          <div className="pointer-events-auto hidden h-14 items-center gap-1 rounded-2xl border border-white/70 bg-white/85 p-1.5 shadow-lg backdrop-blur-xl xl:flex">
            <MainNavLinks />
            <MoreMenu />
          </div>

          <div className="pointer-events-auto flex h-14 items-center gap-1.5 rounded-2xl border border-white/70 bg-white/85 p-1.5 shadow-lg backdrop-blur-xl">
            <div className="hidden sm:block">
              <LanguageSelection className="w-64" />
            </div>
            <GitHubLink />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-100 hover:text-stone-950 xl:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="map-navigation-menu"
              aria-label={mobileMenuOpen ? "Close navigation" : t("menu")}
            >
              {mobileMenuOpen ? (
                <LuX size="21" aria-hidden="true" />
              ) : (
                <LuMenu size="21" aria-hidden="true" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div
              id="map-navigation-menu"
              className="pointer-events-auto absolute end-0 top-[4.5rem] w-[min(36rem,calc(100vw-2rem))] animate-[float-in_150ms_ease-out] rounded-3xl border border-white/70 bg-white/90 p-3 shadow-xl backdrop-blur-xl xl:hidden"
            >
              <div className="grid gap-1 sm:grid-cols-2">
                <MainNavLinks onNavigate={() => setMobileMenuOpen(false)} />
              </div>
              <div className="mt-1">
                <MoreMenu inline onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          )}
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto max-w-[90rem] px-4 sm:px-6"
      >
        <div className="flex h-16 items-center justify-between gap-4">
          <Brand />

          <div className="hidden items-center gap-1 xl:flex">
            <MainNavLinks />
            <MoreMenu />
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSelection className="w-64" />
            </div>
            <GitHubLink />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-100 hover:text-stone-950 xl:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="main-navigation-menu"
              aria-label={mobileMenuOpen ? "Close navigation" : t("menu")}
            >
              {mobileMenuOpen ? (
                <LuX size="21" aria-hidden="true" />
              ) : (
                <LuMenu size="21" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            id="main-navigation-menu"
            className="animate-[float-in_150ms_ease-out] border-t border-stone-200 py-3 xl:hidden"
          >
            <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              <MainNavLinks onNavigate={() => setMobileMenuOpen(false)} />
            </div>
            <div className="mt-1">
              <MoreMenu inline onNavigate={() => setMobileMenuOpen(false)} />
            </div>
            <div className="mt-3 border-t border-stone-200 pt-3 sm:hidden">
              <LanguageSelection className="w-full" />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
