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
        <span className="text-lg">2D</span>
      ) : (
        <span className="text-lg">3D</span>
      )}
    </button>
  );
};

export default GlobeSwitch;
