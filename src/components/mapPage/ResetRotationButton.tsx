import { LuMoveUp } from "react-icons/lu";
import {
  FLOATING_BUTTON_BASE,
  FLOATING_BUTTON_INTERACTIVE,
} from "../../utils/constants";

interface ResetRotationButtonProps {
  rotation: number;
  resetRotation: () => void;
}

const ResetRotationButton = ({
  rotation,
  resetRotation,
}: ResetRotationButtonProps) => {
  return (
    <button
      onClick={resetRotation}
      className={`fixed top-36 right-4 z-50 ${FLOATING_BUTTON_BASE} ${FLOATING_BUTTON_INTERACTIVE}`}
    >
      <LuMoveUp
        className="h-6 w-6 text-stone-700"
        style={{ transform: `rotate(${(rotation / Math.PI) * 180}deg)` }}
      />
    </button>
  );
};

export default ResetRotationButton;
