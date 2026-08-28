import {
  Layer,
  Map,
  Marker,
  Source,
  type MapRef,
} from "@vis.gl/react-maplibre";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
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
    .filter(
      (source): source is MapSource => !!source && !source.unsupportedIn3D,
    )
    .map((source) => expandSubdomainTemplate(source.url));

  useEffect(() => {
    const resize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  const pointGeoJson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: points.map((point) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [point.lon, point.lat],
        },
        properties: {
          name: point.name,
          color: point.color,
        },
      })),
    }),
    [points],
  );

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
      <Source id="map-points" type="geojson" data={pointGeoJson}>
        <Layer
          id="map-point-dots"
          type="circle"
          paint={{
            "circle-radius": 6,
            "circle-color": ["get", "color"],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          }}
        />
        <Layer
          id="map-point-labels"
          type="symbol"
          minzoom={POINT_LABEL_MIN_ZOOM}
          layout={{
            "text-field": ["get", "name"],
            "text-size": 11,
            "text-offset": [0, -1.5],
            "text-anchor": "bottom",
            "text-allow-overlap": false,
          }}
          paint={{
            "text-color": "#1c1917",
            "text-halo-color": "rgba(255,255,255,0.95)",
            "text-halo-width": 2,
          }}
        />
      </Source>
      {userLocation && (
        <Marker longitude={userLocation.lon} latitude={userLocation.lat}>
          <UserLocationDot />
        </Marker>
      )}
    </Map>
  );
});

export default MapLibre;
