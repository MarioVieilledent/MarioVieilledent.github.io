import { useCallback, useRef, useState } from "react";
import LayerMenu from "./LayerMenu";
import { sources } from "../utils/sources";
import ResetRotationButton from "./ResetRotationButton";
import OpenLayerMap from "./OpenLayerMap";
import SearchButton from "./SearchButton";
import { LOCAL_STORAGE_LAYERS_KEY } from "../utils/constants";

const DEFAULT_LAYERS: string[] = [
  sources.find((s) => s.defaultBaseMap)?.name ?? sources[0].name,
];

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
  } catch {
    return DEFAULT_LAYERS;
  }
  return DEFAULT_LAYERS;
};

const MapLayer = () => {
  const [layers, setLayers] = useState<string[]>(getInitialLayers());
  const [rotation, setRotation] = useState(0);

  const triggers = useRef<{
    triggerReset: () => void;
    triggerFlyTo: (lon: number, lat: number, zoom?: number) => void;
  }>(null);
  const resetRotation = useCallback(() => triggers.current?.triggerReset(), []);
  const flyTo = useCallback(
    (lon: number, lat: number, zoom?: number) =>
      triggers.current?.triggerFlyTo(lon, lat, zoom),
    []
  );

  return (
    <>
      <OpenLayerMap setRotation={setRotation} layers={layers} ref={triggers} />

      <SearchButton flyTo={flyTo} />

      <LayerMenu layers={layers} setLayers={setLayers} />
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
