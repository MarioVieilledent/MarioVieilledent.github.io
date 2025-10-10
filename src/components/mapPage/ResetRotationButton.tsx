import { LuMoveUp } from "react-icons/lu";

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
      className="fixed top-20 right-4 z-50 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition"
    >
      <LuMoveUp
        className="w-6 h-6"
        style={{ transform: `rotate(${(rotation / Math.PI) * 180}deg)` }}
      />
    </button>
  );
};

export default ResetRotationButton;
