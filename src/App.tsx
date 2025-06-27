import { useEffect, useState } from "react";
import MapLayer from "./components/MapLayer";
import { LOCAL_STORAGE_ROUTE_KEY } from "./utils/constants";
import Menu from "./components/Menu";
import SearchButton from "./components/SearchButton";

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

  return (
    <>
      <MapLayer />
      <Menu />
      <SearchButton />
    </>
  );
};

export default App;
