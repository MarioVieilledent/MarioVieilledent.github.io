import { LuMoveUp } from "react-icons/lu";
import {
  FLOATING_BUTTON_BASE,
  FLOATING_BUTTON_INTERACTIVE,
} from "../../utils/constants";
import { useIsMobile } from "../../utils/isMobileHook";

interface ResetRotationButtonProps {
  rotation: number;
  resetRotation: () => void;
}

const ResetRotationButton = ({
  rotation,
  resetRotation,
}: ResetRotationButtonProps) => {
  const isMobile = useIsMobile();

  return (
    <button
      onClick={resetRotation}
      className={`absolute ${isMobile ? "top-36" : "top-56"} end-4 z-50 ${FLOATING_BUTTON_BASE} ${FLOATING_BUTTON_INTERACTIVE}`}
    >
      <LuMoveUp
        className="h-6 w-6 text-stone-700"
        style={{ transform: `rotate(${(rotation / Math.PI) * 180}deg)` }}
      />
    </button>
  );
};

export default ResetRotationButton;
