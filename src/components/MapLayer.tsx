import { useCallback, useRef, useState } from "react";
import LayerMenu from "./LayerMenu";
import { sources, LOCAL_STORAGE_LAYERS_KEY } from "../utils/constants";
import ResetRotationButton from "./ResetRotationButton";
import Globe from "../pages/Globe";
import Mercator from "./Mecrator";

const DEFAULT_LAYERS = [sources[0].name];

const getInitialLayers = (): string[] => {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_LAYERS_KEY);
    const parsed = JSON.parse(raw ?? JSON.stringify(DEFAULT_LAYERS));
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
    ) {
      return parsed;
    }
  } catch (e) {
    console.warn("Failed to parse JSON");
    console.warn(e);
  }
  return DEFAULT_LAYERS;
};

export type MapType = "mercator" | "globe";

const MapLayer = () => {
  const [layers, setLayers] = useState<string[]>(getInitialLayers());
  const [rotation, setRotation] = useState(0);
  const [mapType, setMapType] = useState<MapType>("mercator");

  const resetRotationTrigger = useRef<{ triggerReset: () => void }>(null);
  const resetRotation = useCallback(
    () => resetRotationTrigger.current?.triggerReset(),
    []
  );

  return (
    <>
      {mapType === "mercator" && (
        <Mercator
          setRotation={setRotation}
          layers={layers}
          mapType={mapType}
          ref={resetRotationTrigger}
        />
      )}
      {mapType === "globe" && <Globe />}

      <LayerMenu
        layers={layers}
        setLayers={setLayers}
        mapType={mapType}
        setMapType={setMapType}
      />
      {rotation !== 0 && (
        <ResetRotationButton
          rotation={rotation}
          resetRotation={resetRotation}
        />
      )}
    </>
  );
};

export default MapLayer;
