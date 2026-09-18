import { lazy, Suspense } from "react";
import { Routes, Route, HashRouter, Navigate } from "react-router";
import NotFound from "./pages/NotFound";

// Keep every feature page out of the shared application shell. This is
// especially important for MapPage: its rendering libraries and optional
// point datasets should not be downloaded by direct visitors to other routes.
const MapPage = lazy(() => import("./pages/MapPage"));
const Recipes = lazy(() => import("./pages/Recipes"));
const Countries = lazy(() => import("./pages/Countries"));
const LearnNorwegian = lazy(() => import("./pages/LearnNorwegian"));
const TurkishFlashcards = lazy(() => import("./pages/TurkishFlashcards"));
const ArabicAlphabet = lazy(() => import("./pages/ArabicAlphabet"));
const Devanagari = lazy(() => import("./pages/Devanagari"));
const GeorgianAlphabet = lazy(() => import("./pages/GeorgianAlphabet"));
const ArmenianAlphabet = lazy(() => import("./pages/ArmenianAlphabet"));
const HebrewAlphabet = lazy(() => import("./pages/HebrewAlphabet"));
const RunningPace = lazy(() => import("./pages/RunningPace"));

const App = () => {
  return (
    <HashRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route index element={<MapPage />} />
          <Route path="recipes/*" element={<Recipes />} />
          <Route path="countries" element={<Countries />} />
          <Route path="flags" element={<Navigate to="/countries" replace />} />
          <Route path="learnNorwegian" element={<LearnNorwegian />}></Route>
          <Route
            path="turkishFlashcards"
            element={<TurkishFlashcards />}
          ></Route>
          <Route path="arabic-alphabet" element={<ArabicAlphabet />} />
          <Route path="learn-devanagari" element={<Devanagari />} />
          <Route path="learn-georgian-script" element={<GeorgianAlphabet />} />
          <Route path="learn-armenian-script" element={<ArmenianAlphabet />} />
          <Route path="learn-hebrew-script" element={<HebrewAlphabet />} />
          <Route path="pace-converter" element={<RunningPace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
