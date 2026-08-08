# Known issues / things to fix

Findings from a full read-through of the codebase on 2026-08-08. Lint, typecheck, tests, and build all pass as of this writing — everything below was found by reading code and probing behavior, not by tooling failures.

## Bugs (confirmed by reading the logic)

1. **`Flags.tsx` checkbox toggle silently does nothing for the first characteristic.**
   [src/pages/Flags.tsx:55](src/pages/Flags.tsx#L55) does `if (idx) { ... }` where `idx` comes from `findIndex`. `findIndex` returns `0` for the first match, and `0` is falsy in JS, so toggling the very first checkbox in the list never updates state. Fix: `if (idx !== -1)`.

2. **Norwegian quiz shows the wrong success/failure counter.**
   [src/pages/LearnNorwegian.tsx:73](src/pages/LearnNorwegian.tsx#L73) stores stats keyed by `question.word.norwegian`, but the counter rendered next to the question (lines 122–124) reads `stats[question.word.english]`. The two keys are never the same, so the inline counter is always `0/0` regardless of real history (the word list at the bottom of the page reads the correct key and works fine — only the inline counter is wrong).

3. **`OSMnominatimResponse.boundingbox` is typed as `string[4]`, which TypeScript resolves to plain `string`, not a 4-tuple.**
   [src/types/types.ts:15](src/types/types.ts#L15). `T[4]` is an indexed-access type, not fixed-length-array syntax — verified with an isolated `tsc` check against this project's config (`arr: string[4] = ["a","b","c","d"]` fails to typecheck: *"Type 'string[]' is not assignable to type 'string'"*). Because the real runtime value is an array, `computeZoomForBoundingBox`'s destructuring in [src/utils/utils.ts:2](src/utils/utils.ts#L2) happens to work at runtime, but the compiler is silently checking string-iteration semantics instead of the 4-element array you intended — any real type error here (e.g. reading a 5th/missing element) would go undetected. Fix: `boundingbox: [string, string, string, string]`.

4. **No error boundary anywhere, and some `localStorage` reads can throw uncaught.**
   [src/pages/LearnNorwegian.tsx:31-36](src/pages/LearnNorwegian.tsx#L31-L36) does `setStats(JSON.parse(saved))` with no `try/catch`. If that `localStorage` key is ever hand-edited, truncated, or written by a future incompatible version of this app, `JSON.parse` throws during a `useEffect` and — since there's no `ErrorBoundary` anywhere in the tree (checked: none exists) — the whole page goes to a blank white screen with no recovery. `TurkishFlashcards.tsx` and `MapLayer.tsx` already guard the equivalent read with `try/catch`; `LearnNorwegian.tsx` should do the same, and a top-level `ErrorBoundary` around `<App />` would catch the rest.

## Dead / orphaned code

5. **`DragAndDrop.tsx` / `garminUtils.ts` depend on a package that isn't installed.**
   [src/components/mapPage/DragAndDrop.tsx](src/components/mapPage/DragAndDrop.tsx) imports `fitToJSON` from [src/utils/garminUtils.ts](src/utils/garminUtils.ts), which imports `@garmin/fitsdk` — not present in `package.json` or `node_modules`. It only "compiles" because [src/types/garmin-fitsdk.d.ts](src/types/garmin-fitsdk.d.ts) declares an ambient ad-hoc module for it. Neither file is imported from anywhere reachable in the app, so this is fully dead code that would break immediately if ever wired up. Either finish the Garmin `.fit` import feature (install the real dependency, hook `DragAndDrop` into a page) or delete all three files.

6. **`old/index.html`** (1440 lines) is a legacy standalone flashcard page at the repo root, unrelated to the Vite/React app, not linked from anywhere (`index.html`, `README.md`, or app code). Either delete it or move it somewhere clearly archival.

7. **`Flags` page is unreachable from the UI.** It's registered in [src/App.tsx](src/App.tsx) but its `Menu` link is commented out ([src/components/Menu.tsx:41-47](src/components/Menu.tsx#L41-L47)). Same for the `learnTurkish` route — commented out at [src/components/Menu.tsx:55-61](src/components/Menu.tsx#L55-L61) — while `turkishFlashcards` (a different, overlapping feature) is the one actually linked. Decide which of `LearnTurkish` vs `TurkishFlashcards` is the intended feature and either link or remove the other; same for `Flags`.

8. **Confusing, likely-vestigial manual routing state in `App.tsx`.**
   [src/App.tsx:15-28](src/App.tsx#L15-L28) maintains its own `route` state synced to `localStorage` and calls `window.history.pushState({ page: route }, "", "")` on every change — but `<Routes>` (via `HashRouter`) already owns navigation and never reads this state. At best it's dead code; at worst the extra manual `pushState` call on every mount/update inserts spurious history entries that fight with `HashRouter`'s own history management (e.g. back button needing an extra press). Recommend removing this state entirely and letting `react-router` own routing.

## Consistency / correctness risks

9. **`target="_blank"` links without `rel="noopener noreferrer"`.**
   [src/components/Menu.tsx:72](src/components/Menu.tsx#L72) & [:80](src/components/Menu.tsx#L80), [src/components/recipes/RecipesHome.tsx:61](src/components/recipes/RecipesHome.tsx#L61), [:73](src/components/recipes/RecipesHome.tsx#L73), [:81](src/components/recipes/RecipesHome.tsx#L81). Standard reverse-tabnabbing / minor perf issue (the opened page can access `window.opener`). Cheap fix across all five.

10. **Layer selections persist to `localStorage` by source `name`, not a stable id.**
    [src/components/mapPage/MapLayer.tsx:11-28](src/components/mapPage/MapLayer.tsx#L11-L28) and [OpenLayerMap.tsx:94](src/components/mapPage/OpenLayerMap.tsx#L94). Renaming or removing an entry in `src/utils/sources.ts` silently breaks returning users' saved layer selection (base map URL resolves to `""`, i.e. blank tiles) with no fallback/repair. Consider filtering restored layers against the current `sources` list on load, or keying by a stable id.

11. **i18n coverage is inconsistent.** Most of the app runs every string through `t()` (`src/utils/translations.ts`, 10 locales), but `LearnTurkish.tsx` and `TurkishFlashcards.tsx` hardcode all UI copy in English ("Translate to English", "Check answer", "Correct!", etc.) and never call `useTranslation()`. Either bring them into the translation system or accept/document that these two pages are English-only.

12. **`TurkishFlashcards.tsx` has no way back to the rest of the site.** Unlike every other page, it never renders `<Home />` or `<NavigateTo />` — the only way out is the browser back button.

13. **`LearnTurkish.tsx` default-exports a component literally named `App`** ([src/pages/LearnTurkish.tsx:336](src/pages/LearnTurkish.tsx#L336)), which shadows the real `App` name and shows up as "App" in React DevTools. Rename to `LearnTurkish`.

## Performance

14. **No code-splitting; two large chunks ship on every visit.** `npm run build` currently warns:
    ```
    dist/assets/index-*.js          904.68 kB │ gzip: 253.91 kB
    dist/assets/maplibre-gl-*.js  1,053.37 kB │ gzip: 284.75 kB
    ```
    The MapLibre 3D globe is opt-in (behind `GlobeSwitch`) and the recipe/learning pages are separate routes, but everything is eagerly bundled into the initial load. `React.lazy()` per-route (and dynamic-importing `MapLibre` only when globe view is toggled) would cut initial payload substantially, especially relevant since the whole `wordsNorwegian.ts` (1631 lines) and `turkishWords.tsx` (4417 lines) data files are also bundled into the main chunk today regardless of which page is visited.

15. **`public/favicon.png` is 628 KB** for what's used as a small logo/favicon throughout the UI ([src/components/Menu.tsx:3](src/components/Menu.tsx#L3), [Recipes.tsx:20](src/pages/Recipes.tsx#L20)). Worth compressing/resizing.

## Minor / cosmetic

16. **README broken link and typo.** [README.md](README.md) advertises `https://mariovieilledent.github.io/#/learn`, but the actual route (per `App.tsx`) is `#/learnNorwegian` — the README's own link 404s to the app's `NotFound` page. Also "Learn Noregian" → "Learn Norwegian".

17. **`LanguageSelection` keeps a redundant local `selected` state** ([src/components/LanguageSelection.tsx:13](src/components/LanguageSelection.tsx#L13)) that duplicates `language` from context, initialized once and never resynced if `language` changes elsewhere. Low risk today (nothing else currently changes `language` externally) but a footgun — just use `language` directly from context instead of shadowing it.

## Not a bug, just worth knowing

- There is no CI (`.github/workflows` doesn't exist). `npm run precommit` (lint + test + build) is the only gate, and it's manual.
- Deployment is manual via `npm run publish` (`gh-pages` package pushes `dist/` to the `gh-pages` branch) — nothing automatic on push to `master`.
