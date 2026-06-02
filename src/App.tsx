import { useEffect, useState } from "react";
import { LOCAL_STORAGE_ROUTE_KEY } from "./utils/constants";
import { Routes, Route, HashRouter } from "react-router";
import LearnNorwegian from "./pages/LearnNorwegian";
import MapPage from "./pages/MapPage";
import Recipes from "./pages/Recipes";
import NotFound from "./pages/NotFound";
import Flags from "./pages/Flags";
import LearnTurkish from "./pages/LearnTurkish";
import TurkishFlashcards from "./pages/TurkishFlashcards";

const DEFAULT_PAGE = "home";

const App = () => {
  const [route, setRoute] = useState(
    window.localStorage.getItem(LOCAL_STORAGE_ROUTE_KEY) ?? DEFAULT_PAGE,
  );

  useEffect(() => {
    const handler = (event: PopStateEvent) =>
      setRoute(event.state?.page ?? DEFAULT_PAGE);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_ROUTE_KEY, route);
    window.history.pushState({ page: route }, "", "");
  }, [route]);

  return (
    <HashRouter>
      <Routes>
        <Route index element={<MapPage />} />
        <Route path="recipes/*" element={<Recipes />} />
        <Route path="flags" element={<Flags />}></Route>
        <Route path="learnNorwegian" element={<LearnNorwegian />}></Route>
        <Route path="learnTurkish" element={<LearnTurkish />}></Route>
        <Route path="turkishFlashcards" element={<TurkishFlashcards />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
