import { lazy, Suspense } from "react";
import { Routes, Route, HashRouter, Navigate } from "react-router";
import MapPage from "./pages/MapPage";
import NotFound from "./pages/NotFound";

// MapPage is the landing route almost every visit hits, so it stays eagerly
// bundled. Everything else is opt-in navigation, so it's worth the extra
// network round trip to keep it out of the initial payload.
const Recipes = lazy(() => import("./pages/Recipes"));
const Countries = lazy(() => import("./pages/Countries"));
const LearnNorwegian = lazy(() => import("./pages/LearnNorwegian"));
const TurkishFlashcards = lazy(() => import("./pages/TurkishFlashcards"));
const ArabicAlphabet = lazy(() => import("./pages/ArabicAlphabet"));
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
          <Route path="pace-converter" element={<RunningPace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
