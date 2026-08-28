import { Layer, Map, Marker, Source, type MapRef } from "@vis.gl/react-maplibre";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { sources } from "../../utils/sources";
import type { Source as MapSource } from "../../types/types";
import UserLocationDot from "./UserLocationDot";
import type { MapPoint } from "../../types/types";

const FLY_DURATION = 500;
const POINT_LABEL_MIN_ZOOM = 10;

interface MapLibreProps {
  layers: string[];
  center: [number, number];
  zoom: number;
  onPositionChange: (center: [number, number], zoom: number) => void;
  userLocation: { lon: number; lat: number } | null;
  points: MapPoint[];
}

// OpenLayers (the 2D renderer) natively expands a "{a-c}" subdomain-rotation
// placeholder into a, b, c, but MapLibre GL only understands {z}/{x}/{y} in a
// raster source's tile URLs — it leaves "{a-c}" untouched, so it ends up
// requesting the literal (nonexistent) host "{a-c}.tile...", which fails.
// MapLibre's `tiles` option accepts multiple URL templates for exactly this
// kind of load balancing, so we expand the range into one URL per subdomain.
const SUBDOMAIN_RANGE_PATTERN = /\{([a-z0-9])-([a-z0-9])\}/;

const expandSubdomainTemplate = (url: string): string[] => {
  const match = url.match(SUBDOMAIN_RANGE_PATTERN);
  if (!match) return [url];

  const [placeholder, start, end] = match;
  const startCode = start.charCodeAt(0);
  const endCode = end.charCodeAt(0);
  if (startCode > endCode) return [url];

  const subdomains: string[] = [];
  for (let code = startCode; code <= endCode; code++) {
    subdomains.push(String.fromCharCode(code));
  }

  return subdomains.map((subdomain) => url.replace(placeholder, subdomain));
};

const MapLibre = forwardRef<
  {
    triggerReset: () => void;
    triggerFlyTo: (lon: number, lat: number, zoom?: number) => void;
  },
  MapLibreProps
>(({ layers, center, zoom, onPositionChange, userLocation, points }, ref) => {
  const mapRef = useRef<MapRef>(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [showPointLabels, setShowPointLabels] = useState(
    zoom >= POINT_LABEL_MIN_ZOOM,
  );

  useImperativeHandle(ref, () => ({
    triggerReset() {
      mapRef.current?.resetNorthPitch({ duration: FLY_DURATION });
    },
    triggerFlyTo(lon: number, lat: number, zoom?: number) {
      mapRef.current?.flyTo({
        center: [lon, lat],
        zoom: zoom ?? mapRef.current.getZoom(),
        duration: FLY_DURATION,
      });
    },
  }));

  // Sources flagged unsupportedIn3D (no CORS headers on the tile server) are
  // skipped entirely here rather than requested-and-failed: WebGL blocks the
  // texture load outright, so there's nothing to gracefully retry.
  const layerTiles: string[][] = layers
    .map((layerName) => sources.find((source) => source.name === layerName))
    .filter((source): source is MapSource => !!source && !source.unsupportedIn3D)
    .map((source) => expandSubdomainTemplate(source.url));

  useEffect(() => {
    const resize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: center[0],
        latitude: center[1],
        zoom,
      }}
      // Fires once after a pan/zoom settles (not on every frame), matching
      // the 2D renderer's "moveend"-based reporting.
      onMoveEnd={(event) =>
        onPositionChange(
          [event.viewState.longitude, event.viewState.latitude],
          event.viewState.zoom,
        )
      }
      onZoomEnd={(event) =>
        setShowPointLabels(event.viewState.zoom >= POINT_LABEL_MIN_ZOOM)
      }
      style={{ width, height }}
      mapStyle="https://demotiles.maplibre.org/globe.json"
    >
      {layerTiles.map((tiles, index) => (
        <Source
          key={`${index} ${tiles[0]}`}
          id={`${index} ${tiles[0]}`}
          type="raster"
          tiles={tiles}
          tileSize={256}
        >
          <Layer
            id={`${index} ${tiles[0]}`}
            type="raster"
            paint={{
              "raster-opacity": 1.0,
            }}
          />
        </Source>
      ))}
      {points.map((point) => (
        <Marker
          key={`${point.source}-${point.id}`}
          longitude={point.lon}
          latitude={point.lat}
          anchor="center"
        >
          <div
            className="relative h-3 w-3 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: point.color }}
            title={`${point.name} — ${point.address}, ${point.city}`}
          >
            {showPointLabels && (
              <span className="pointer-events-none absolute bottom-4 left-1/2 w-max max-w-48 -translate-x-1/2 rounded bg-white/90 px-1.5 py-0.5 text-center text-[11px] font-semibold leading-tight text-stone-900 shadow">
                {point.name}
              </span>
            )}
          </div>
        </Marker>
      ))}
      {userLocation && (
        <Marker longitude={userLocation.lon} latitude={userLocation.lat}>
          <UserLocationDot />
        </Marker>
      )}
    </Map>
  );
});

export default MapLibre;
