# Known issues / things to fix

Findings from a full read-through of the codebase on 2026-08-08. All items from
that read-through have since been resolved (fixed in code, or confirmed
already fixed/no longer applicable) — see the changelog at the bottom for
what happened to each. This file is kept as a log; add new findings above the
changelog when they turn up.

## Not a bug, just worth knowing

- There is no CI (`.github/workflows` doesn't exist). `npm run precommit` (lint + test + build) is the only gate, and it's manual.
- Deployment is manual via `npm run publish` (`gh-pages` package pushes `dist/` to the `gh-pages` branch) — nothing automatic on push to `master`.
- `TurkishFlashcards.tsx` hardcodes its UI copy in English and doesn't use the `t()` translation system that the rest of the app uses (`src/utils/translations.ts`, 10 locales). Decided to accept this rather than translate it: the flashcard content itself (`src/turkishWords.tsx`) is English/Turkish-only, so full i18n would only cover the UI chrome, not the actual learning content.

## Resolved (2026-08-08 pass)

1. **`Flags.tsx` checkbox toggle bug.** Fixed: `if (idx)` → `if (idx !== -1)` at [src/pages/Flags.tsx](src/pages/Flags.tsx) — `findIndex` returning `0` for the first match was being treated as falsy.
2. **Norwegian quiz wrong success/failure counter.** Fixed: the inline counter now reads `stats[question.word.norwegian]`, matching the key it's actually stored under, in [src/pages/LearnNorwegian.tsx](src/pages/LearnNorwegian.tsx).
3. **`OSMnominatimResponse.boundingbox` mistyped as `string[4]`.** Fixed to the intended 4-tuple `[string, string, string, string]` in [src/types/types.ts](src/types/types.ts) and [src/utils/utils.ts](src/utils/utils.ts).
4. **No error boundary; unguarded `JSON.parse` in `LearnNorwegian`.** Fixed: the `localStorage` read is now wrapped in `try/catch` (matching the existing pattern in `TurkishFlashcards.tsx`/`MapLayer.tsx`), and a top-level [src/components/ErrorBoundary.tsx](src/components/ErrorBoundary.tsx) now wraps `<App />` in `main.tsx`.
5. **Garmin `.fit` import dead code.** Deleted `DragAndDrop.tsx`, `garminUtils.ts`, and the `garmin-fitsdk.d.ts` ambient stub — unreachable from anywhere in the app and dependent on an uninstalled package.
6. **Legacy `old/index.html`.** Deleted — unrelated to the Vite app and unlinked from anywhere.
7. **Unreachable `Flags` page; duplicate Turkish-learning pages.** `Flags` is now linked from the menu ([src/components/Menu.tsx](src/components/Menu.tsx)). `LearnTurkish.tsx` (and its only consumer, `turkishSentences.ts`, plus its audio clips under `public/audio/turkishSentences/`) was deleted in favor of `TurkishFlashcards.tsx`, which was already the one actually linked.
8. **Vestigial manual routing state in `App.tsx`.** No longer present — `App.tsx` only renders `<Routes>` now.
9. **`target="_blank"` links without `rel="noopener noreferrer"`.** Already fixed everywhere it was flagged (`Menu.tsx`, `RecipesHome.tsx`).
10. **Layer selections keyed by `localStorage` name, not a stable id.** Already handled: `MapLayer.tsx`'s `resolveBaseLayer`/`resolveOverlayLayers` filter restored layers against the current `sources` list and fall back to the default base layer if a saved name no longer resolves.
11. **i18n coverage inconsistent for the Turkish pages.** `LearnTurkish.tsx` was deleted (see #7). `TurkishFlashcards.tsx` staying English-only is now a documented decision — see "Not a bug, just worth knowing" above.
12. **`TurkishFlashcards.tsx` had no way back to the rest of the site.** Fixed: it now renders `<Home />`.
13. **`LearnTurkish.tsx` default-exported a component named `App`.** Moot — the file was deleted (see #7).
14. **No code-splitting.** `App.tsx` now lazy-loads every route except the landing `MapPage` via `React.lazy`/`Suspense`. `MapLayer.tsx` additionally lazy-loads `MapLibre` (the ~1MB maplibre-gl chunk) so it's only fetched when the user actually toggles to the 3D globe view.
15. **`public/favicon.png` was 628 KB.** Re-encoded (resized to 512×512, palette-quantized) down to ~185 KB with no visible quality loss at the sizes it's actually displayed at.
16. **README broken link and typo.** Fixed the `#/learn` link to `#/learnNorwegian` and "Learn Noregian" → "Learn Norwegian"; also dropped the now-unused "Audio generation for Turkish sentences" section (that audio pipeline belonged to the deleted `LearnTurkish` page).
17. **`LanguageSelection` redundant local `selected` state.** No longer present — the component reads `language` directly from context.
