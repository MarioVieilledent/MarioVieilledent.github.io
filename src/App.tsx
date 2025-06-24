import { useEffect, useState, type ReactNode } from "react";
import Home from "./pages/Home";
import Norwegian from "./pages/Norwegian";
import Globe from "./pages/Globe";
import MapLayer from "./components/MapLayer";
import type { TermKeys } from "./utils/TranslationContext";
import { LOCAL_STORAGE_ROUTE_KEY } from "./utils/constants";
import Menu from "./components/Menu";

const DEFAULT_PAGE = "home";

const App = () => {
  const [route, setRoute] = useState(
    window.localStorage.getItem(LOCAL_STORAGE_ROUTE_KEY) ?? DEFAULT_PAGE
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

  const pages: { name: TermKeys; component: ReactNode }[] = [
    { name: "home", component: <Home /> },
    { name: "map", component: <MapLayer /> },
    { name: "globe", component: <Globe /> },
    { name: "norwegian", component: <Norwegian /> },
  ];

  return (
    <>
      <MapLayer />
      <Menu pages={pages} route={route} setRoute={setRoute} />
    </>
  );
};

export default App;
