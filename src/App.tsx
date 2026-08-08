import { Routes, Route, HashRouter } from "react-router";
import LearnNorwegian from "./pages/LearnNorwegian";
import MapPage from "./pages/MapPage";
import Recipes from "./pages/Recipes";
import NotFound from "./pages/NotFound";
import Flags from "./pages/Flags";
import LearnTurkish from "./pages/LearnTurkish";
import TurkishFlashcards from "./pages/TurkishFlashcards";

const App = () => {
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
