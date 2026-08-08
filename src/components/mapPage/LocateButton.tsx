import { useState } from "react";
import { LuLocate, LuLocateFixed, LuLocateOff, LuLoaderCircle } from "react-icons/lu";
import {
  FLOATING_BUTTON_BASE,
  FLOATING_BUTTON_INTERACTIVE,
} from "../../utils/constants";

// How long the error icon stays up before the button resets to idle, so the
// user gets feedback (e.g. permission denied) without it lingering forever.
const ERROR_RESET_DELAY = 3000;

interface LocateButtonProps {
  onLocate: (lon: number, lat: number, accuracy: number) => void;
}

type Status = "idle" | "locating" | "found" | "error";

const LocateButton = ({ onLocate }: LocateButtonProps) => {
  const [status, setStatus] = useState<Status>("idle");

  const handleClick = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), ERROR_RESET_DELAY);
      return;
    }

    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocate(
          position.coords.longitude,
          position.coords.latitude,
          position.coords.accuracy,
        );
        setStatus("found");
      },
      (error) => {
        console.warn(error);
        setStatus("error");
        setTimeout(() => setStatus("idle"), ERROR_RESET_DELAY);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Locate me"
      title="Locate me"
      className={`fixed right-4 bottom-4 z-50 ${FLOATING_BUTTON_BASE} ${FLOATING_BUTTON_INTERACTIVE}`}
    >
      {status === "locating" && (
        <LuLoaderCircle className="h-6 w-6 animate-spin text-amber-500" />
      )}
      {status === "error" && <LuLocateOff className="h-6 w-6 text-red-500" />}
      {status === "found" && (
        <LuLocateFixed className="h-6 w-6 text-amber-500" />
      )}
      {status === "idle" && <LuLocate className="h-6 w-6 text-stone-700" />}
    </button>
  );
};

export default LocateButton;
