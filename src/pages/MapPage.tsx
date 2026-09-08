import MapLayer from "../components/mapPage/MapLayer";
import Menu from "../components/Menu";
import Navbar from "../components/Navbar";
import { useIsMobile } from "../utils/isMobileHook";

const MapPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {!isMobile && <Navbar />}
      <main className="relative min-h-0 flex-1 overflow-hidden">
        <MapLayer />
        {isMobile && <Menu />}
      </main>
    </div>
  );
};

export default MapPage;
