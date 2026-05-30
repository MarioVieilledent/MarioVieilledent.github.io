import { LuGlobe, LuMap } from "react-icons/lu";

interface GlobeSwitchProps {
  globeView: boolean;
  setGlobeView: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobeSwitch = ({ globeView, setGlobeView }: GlobeSwitchProps) => {
  return (
    <button
      onClick={() => setGlobeView((prev) => !prev)}
      className="fixed top-20 right-4 z-50 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition"
    >
      {globeView ? (
        <LuMap className="w-6 h-6" />
      ) : (
        <LuGlobe className="w-6 h-6" />
      )}
    </button>
  );
};

export default GlobeSwitch;
