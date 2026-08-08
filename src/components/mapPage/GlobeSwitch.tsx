import {
  FLOATING_BUTTON_BASE,
  FLOATING_BUTTON_INTERACTIVE,
} from "../../utils/constants";

interface GlobeSwitchProps {
  globeView: boolean;
  setGlobeView: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobeSwitch = ({ globeView, setGlobeView }: GlobeSwitchProps) => {
  return (
    <button
      onClick={() => setGlobeView((prev) => !prev)}
      className={`fixed top-20 right-4 z-50 ${FLOATING_BUTTON_BASE} ${FLOATING_BUTTON_INTERACTIVE}`}
    >
      <span className="text-sm font-semibold text-stone-700">
        {globeView ? "2D" : "3D"}
      </span>
    </button>
  );
};

export default GlobeSwitch;
