import MapLayer from "../components/mapPage/MapLayer";
import Menu from "../components/Menu";
import Navbar from "../components/Navbar";
import { useIsMobile } from "../utils/isMobileHook";

const MapPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="h-dvh overflow-hidden">
      <main className="relative h-full overflow-hidden">
        <MapLayer />
        {!isMobile && <Navbar mapOverlay />}
        {isMobile && <Menu />}
      </main>
    </div>
  );
};

export default MapPage;
