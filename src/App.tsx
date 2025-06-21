import { useState, type ReactNode } from "react";
import Home from "./pages/Home";
import Norwegian from "./pages/Norwegian";
import Outlet from "./Outlet";
import { type termKeys } from "./components/translations";
import NoMatchPage from "./pages/NoMatchPage";
import Flags from "./pages/Flags";
import MapPage from "./pages/MapPage";

export const pages: { name: termKeys; component: ReactNode }[] = [
  { name: "home", component: <Home /> },
  { name: "map", component: <MapPage /> },
  { name: "norwegian", component: <Norwegian /> },
  { name: "flags", component: <Flags /> },
];

const App = () => {
  const [route, setRoute] = useState("home");

  return (
    <Outlet setRoute={setRoute}>
      {pages.find((page) => page.name === route)?.component ?? <NoMatchPage />}
    </Outlet>
  );
};

export default App;
