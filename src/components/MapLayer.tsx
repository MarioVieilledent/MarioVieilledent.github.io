import { useCallback, useRef, useState } from "react";
import LayerMenu from "./LayerMenu";
import { knownTileSources, LOCAL_STORAGE_LAYER_KEY } from "../utils/constants";
import ResetRotationButton from "./ResetRotationButton";
import Globe from "../pages/Globe";
import Mercator from "./Mecrator";

const DEFAULT_LAYER = knownTileSources[0].name;

export type MapType = "mercator" | "globe";

const MapLayer = () => {
  const [layer, setLayer] = useState<string>(
    window.localStorage.getItem(LOCAL_STORAGE_LAYER_KEY) ?? DEFAULT_LAYER
  );
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
          layer={layer}
          mapType={mapType}
          ref={resetRotationTrigger}
        />
      )}
      {mapType === "globe" && <Globe />}

      <LayerMenu
        layer={layer}
        setLayer={setLayer}
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
