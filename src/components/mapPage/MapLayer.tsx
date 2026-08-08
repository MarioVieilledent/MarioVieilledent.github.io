import { useCallback, useEffect, useRef, useState } from "react";
import LayerMenu from "./LayerMenu";
import { sources } from "../../utils/sources";
import ResetRotationButton from "./ResetRotationButton";
import OpenLayerMap from "./OpenLayerMap";
import {
  BASE_LAYER_QUERY_PARAM,
  CENTER_QUERY_PARAM,
  LAYERS_QUERY_PARAM,
  LOCAL_STORAGE_CENTER_KEY,
  LOCAL_STORAGE_LAYERS_KEY,
  LOCAL_STORAGE_VIEW_KEY,
  LOCAL_STORAGE_ZOOM_KEY,
  VIEW_QUERY_PARAM,
  ZOOM_QUERY_PARAM,
} from "../../utils/constants";
import { getURLParam, setURLParam } from "../../utils/urlSync";
import SearchButton from "./SearchButton";
import MapLibre from "./MapLibre";
import GlobeSwitch from "./GlobeSwitch";
import LocateButton from "./LocateButton";

const DEFAULT_LAYERS: string[] = sources
  .filter((s) => s.defaultSelectedLayers)
  .map((s) => s.name);

const DEFAULT_CENTER: [number, number] = [5, 55];
const DEFAULT_ZOOM = 4;
const LOCATE_ZOOM = 16;

// Web Mercator projection round-trips (lon/lat -> internal projected coords
// -> lon/lat) introduce floating-point noise (e.g. 48.85 -> 48.849999999999994).
// Rounding before persisting keeps the URL/localStorage values clean and
// shareable; 6 decimal places is sub-meter precision, far more than needed
// at any zoom level.
const CENTER_PRECISION = 6;
const ZOOM_PRECISION = 2;

const round = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const isBaseLayerName = (name: string): boolean => {
  const source = sources.find((s) => s.name === name);
  return source !== undefined && !source.type.startsWith("overlay");
};

const isOverlayLayerName = (name: string): boolean => {
  const source = sources.find((s) => s.name === name);
  return source !== undefined && source.type.startsWith("overlay");
};

const readStoredLayers = (): string[] | null => {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_LAYERS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
    ) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
};

const parseOverlaysParam = (value: string | null): string[] | null => {
  if (value === null) return null;
  return value
    .split(",")
    .map((name) => name.trim())
    .filter(isOverlayLayerName);
};

const resolveBaseLayer = (storedBase: string | undefined): string | undefined => {
  const urlBase = getURLParam(BASE_LAYER_QUERY_PARAM);
  if (urlBase && isBaseLayerName(urlBase)) return urlBase;
  if (storedBase && isBaseLayerName(storedBase)) return storedBase;
  return DEFAULT_LAYERS[0];
};

const resolveOverlayLayers = (storedOverlays: string[] | undefined): string[] => {
  const urlOverlays = parseOverlaysParam(getURLParam(LAYERS_QUERY_PARAM));
  if (urlOverlays !== null) return urlOverlays;
  if (storedOverlays) return storedOverlays.filter(isOverlayLayerName);
  return DEFAULT_LAYERS.slice(1);
};

// Base layer and overlay layers are each resolved independently, in
// priority order URL param > localStorage > default (this also drops any
// stale/renamed source names left over from an old localStorage value),
// then combined into the single array the rest of the map page expects
// (index 0 = base layer, the rest = overlays).
const getInitialLayers = (): string[] => {
  const stored = readStoredLayers();
  const base = resolveBaseLayer(stored?.[0]);
  const overlays = resolveOverlayLayers(stored?.slice(1));
  return base ? [base, ...overlays] : overlays;
};

const getInitialGlobeView = (): boolean => {
  const urlView = getURLParam(VIEW_QUERY_PARAM);
  if (urlView === "2d") return false;
  if (urlView === "3d") return true;

  return window.localStorage.getItem(LOCAL_STORAGE_VIEW_KEY) === "3d";
};

const parseCenter = (value: string | null): [number, number] | null => {
  if (!value) return null;
  const parts = value.split(",").map((part) => Number(part.trim()));
  if (parts.length !== 2) return null;

  const [lon, lat] = parts;
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
  if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return null;

  return [lon, lat];
};

const parseZoom = (value: string | null): number | null => {
  if (!value) return null;
  const zoom = Number(value);
  if (!Number.isFinite(zoom) || zoom < 0 || zoom > 24) return null;
  return zoom;
};

const getInitialCenter = (): [number, number] => {
  const fromURL = parseCenter(getURLParam(CENTER_QUERY_PARAM));
  if (fromURL) return fromURL;

  const fromStorage = parseCenter(
    window.localStorage.getItem(LOCAL_STORAGE_CENTER_KEY),
  );
  if (fromStorage) return fromStorage;

  return DEFAULT_CENTER;
};

const getInitialZoom = (): number => {
  const fromURL = parseZoom(getURLParam(ZOOM_QUERY_PARAM));
  if (fromURL !== null) return fromURL;

  const fromStorage = parseZoom(
    window.localStorage.getItem(LOCAL_STORAGE_ZOOM_KEY),
  );
  if (fromStorage !== null) return fromStorage;

  return DEFAULT_ZOOM;
};

const MapLayer = () => {
  const [layers, setLayers] = useState<string[]>(getInitialLayers);
  const [rotation, setRotation] = useState(0);
  const [globeView, setGlobeView] = useState<boolean>(getInitialGlobeView);
  // Owned here (not inside either renderer) so it survives the 2D/3D toggle:
  // switching unmounts one renderer and mounts the other, but this state
  // lives in the parent and is just handed to whichever one is active.
  const [center, setCenter] = useState<[number, number]>(getInitialCenter);
  const [zoom, setZoom] = useState<number>(getInitialZoom);
  const [userLocation, setUserLocation] = useState<{
    lon: number;
    lat: number;
  } | null>(null);

  const triggers = useRef<{
    triggerReset: () => void;
    triggerFlyTo: (lon: number, lat: number, zoom?: number) => void;
  }>(null);
  const resetRotation = useCallback(() => triggers.current?.triggerReset(), []);
  const flyTo = useCallback(
    (lon: number, lat: number, zoom?: number) =>
      triggers.current?.triggerFlyTo(lon, lat, zoom),
    [],
  );
  const handleLocate = useCallback(
    (lon: number, lat: number) => {
      setUserLocation({ lon, lat });
      flyTo(lon, lat, LOCATE_ZOOM);
    },
    [flyTo],
  );
  const handlePositionChange = useCallback(
    (newCenter: [number, number], newZoom: number) => {
      setCenter(newCenter);
      setZoom(newZoom);
    },
    [],
  );

  useEffect(() => {
    window.localStorage.setItem(
      LOCAL_STORAGE_LAYERS_KEY,
      JSON.stringify(layers),
    );
    setURLParam(BASE_LAYER_QUERY_PARAM, layers[0] ?? null);
    setURLParam(LAYERS_QUERY_PARAM, layers.slice(1).join(","));
  }, [layers]);

  useEffect(() => {
    const view = globeView ? "3d" : "2d";
    window.localStorage.setItem(LOCAL_STORAGE_VIEW_KEY, view);
    setURLParam(VIEW_QUERY_PARAM, view);
  }, [globeView]);

  useEffect(() => {
    const centerValue = `${round(center[0], CENTER_PRECISION)},${round(center[1], CENTER_PRECISION)}`;
    window.localStorage.setItem(LOCAL_STORAGE_CENTER_KEY, centerValue);
    setURLParam(CENTER_QUERY_PARAM, centerValue);

    const zoomValue = String(round(zoom, ZOOM_PRECISION));
    window.localStorage.setItem(LOCAL_STORAGE_ZOOM_KEY, zoomValue);
    setURLParam(ZOOM_QUERY_PARAM, zoomValue);
  }, [center, zoom]);

  // These params only make sense while on the map page. localStorage already
  // remembers the values, so on navigating away we can drop them from the
  // URL entirely rather than leaving them dangling on unrelated pages.
  useEffect(() => {
    return () => {
      setURLParam(BASE_LAYER_QUERY_PARAM, null);
      setURLParam(LAYERS_QUERY_PARAM, null);
      setURLParam(VIEW_QUERY_PARAM, null);
      setURLParam(CENTER_QUERY_PARAM, null);
      setURLParam(ZOOM_QUERY_PARAM, null);
    };
  }, []);

  return (
    <>
      {globeView ? (
        <MapLibre
          layers={layers}
          center={center}
          zoom={zoom}
          onPositionChange={handlePositionChange}
          userLocation={userLocation}
          ref={triggers}
        />
      ) : (
        <OpenLayerMap
          setRotation={setRotation}
          layers={layers}
          center={center}
          zoom={zoom}
          onPositionChange={handlePositionChange}
          userLocation={userLocation}
          ref={triggers}
        />
      )}

      <SearchButton flyTo={flyTo} />

      <LayerMenu layers={layers} setLayers={setLayers} globeView={globeView} />
      <GlobeSwitch globeView={globeView} setGlobeView={setGlobeView} />
      {rotation !== 0 && (
        <ResetRotationButton
          rotation={rotation}
          resetRotation={resetRotation}
        />
      )}
      <LocateButton onLocate={handleLocate} />
    </>
  );
};

export default MapLayer;
