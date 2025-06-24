import { useState, type ReactNode } from "react";
import Home from "./pages/Home";
import Norwegian from "./pages/Norwegian";
import Outlet from "./Outlet";
import NoMatchPage from "./pages/NoMatchPage";
import Globe from "./pages/Globe";
import MapPage from "./pages/MapPage";
import type { TermKeys } from "./utils/TranslationContext";

const App = () => {
  const [route, setRoute] = useState("globe");

  const pages: { name: TermKeys; component: ReactNode }[] = [
    { name: "home", component: <Home /> },
    { name: "map", component: <MapPage /> },
    { name: "globe", component: <Globe /> },
    { name: "norwegian", component: <Norwegian /> },
  ];

  return (
    <Outlet setRoute={setRoute} pages={pages}>
      {pages.find((page) => page.name === route)?.component ?? <NoMatchPage />}
    </Outlet>
  );
};

export default App;
