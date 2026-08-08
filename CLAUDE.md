# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm i` — install dependencies
- `npm run dev` — start the Vite dev server on port 3664
- `npm run build` — typecheck (`tsc -b`) then build to `./dist`
- `npm run lint` — run ESLint over the whole project
- `npm test` — run the Vitest suite once (`vitest run`)
- `npx vitest run src/utils/utils.test.ts` — run a single test file
- `npm run precommit` — chains lint, test, and build; run this before committing
- `npm run preview` — serve the built `./dist` locally
- `npm run publish` — build and publish `./dist` to the `gh-pages` branch (deploys to production — do not run without being asked)

There is no CI configured (no `.github/workflows`); `precommit` is the closest thing to a gate and is not enforced automatically.

## Architecture

This is a single-page personal website (Vite + React 19 + TypeScript + Tailwind v4), deployed as a static site to GitHub Pages at the root of `mariovieilledent.github.io`. It bundles several unrelated mini-apps behind one router:

- **Map explorer** (`/` — `src/pages/MapPage.tsx`) — the home page. Renders either an OpenLayers 2D map (`OpenLayerMap.tsx`) or a MapLibre 3D globe (`MapLibre.tsx`), toggled by `GlobeSwitch`. `MapLibre.tsx` is dynamically imported (`React.lazy`) so its ~1MB `maplibre-gl` dependency is only fetched once the user actually toggles to 3D. Both renderers accept an optional `userLocation` and expose a `triggerFlyTo`/`triggerReset` imperative handle via `forwardRef`, used by `SearchButton` and `LocateButton` (geolocation, bottom-right floating button). Available tile layers live in `src/utils/sources.ts` (a flat list of `{ name, url, type, description }`); `type` drives which section of `LayerMenu` a source appears in (`general`, `topographic`, `satellite`, `hybrid`, `outdoor`, `transport`, `overlay*`). Selected layers are persisted to `localStorage` **by name**; `MapLayer.tsx`'s `resolveBaseLayer`/`resolveOverlayLayers` filter restored names against the current `sources` list and fall back to the default base layer if a saved name no longer resolves (e.g. after a rename in `sources.ts`).
- **Recipes** (`/recipes/*` — `src/pages/Recipes.tsx`) — its own nested `<Routes>` for categories/items, driven by regex-parsing `location.pathname` (`REGEX_CATEGORY`/`REGEX_RECIPE`) rather than route params. Content is fetched at runtime from `public/recipes.json` and `public/feasts.json` and validated with Zod schemas in `src/utils/validator.ts` (`recipe`, `feast`). Each recipe/feast has per-language detail objects (`en`, `fr`, `it`, ...); components fall back to `.en` when the active language's key is missing.
- **Language learning** — two independent, inconsistent implementations: `LearnNorwegian.tsx` (quiz against `src/wordsNorwegian.ts`, uses the shared translation system) and `TurkishFlashcards.tsx` (flashcards against `src/turkishWords.tsx`, hardcoded English UI strings — accepted as English-only rather than brought into the translation system, since the flashcard content itself isn't localized either). Word list data files are large and hand-maintained.
- **Flags** (`/flags` — `src/pages/Flags.tsx`) — fetches `public/countries.json`; linked from the `Menu`.

Cross-cutting pieces:
- **i18n**: `src/utils/TranslationContext.ts` defines `languages` (10 locales) and `useTranslation()`, which indexes into the giant `translations` object in `src/utils/translations.ts` (one array of 10 strings per key, ordered to match `languages[].index`). Language choice persists to `localStorage`. Not all pages use this system (see `TurkishFlashcards.tsx` above).
- **Routing**: `react-router`'s `HashRouter` (routes are `#/...`, required for GitHub Pages static hosting). All routes except the landing `MapPage` are `React.lazy`-loaded behind a top-level `<Suspense>` in `App.tsx`.
- **Responsive layout**: no CSS breakpoints — components branch on the `useIsMobile()` hook (`src/utils/isMobileHook.ts`, default breakpoint 768px) and render different className strings/markup for mobile vs. desktop.
- **Static assets**: everything under `public/` is served as-is (flags as SVGs by ISO code, food photos, the JSON content files above). Reference them with root-relative paths (`/flags/xx.svg`, `/food/....jpg`).
- **Error handling**: a top-level `ErrorBoundary` (`src/components/ErrorBoundary.tsx`) wraps `<App />` in `main.tsx` and shows a reload prompt instead of a blank page if a render throws (e.g. a corrupted `localStorage` value).

## Notes

- Known issues and cleanup candidates are tracked in [docs/known-issues.md](docs/known-issues.md).
