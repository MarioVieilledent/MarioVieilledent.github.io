import { Layer, Map, Source } from "@vis.gl/react-maplibre";
import { useEffect, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { sources } from "../../utils/sources";

interface MapLibreProps {
  layers: string[];
}

const MapLibre = ({ layers }: MapLibreProps) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const urls: string[] = layers.map(
    (layerName) =>
      sources.find((source) => source.name === layerName)?.url ?? "",
  );

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
      initialViewState={{
        longitude: 10,
        latitude: 50,
        zoom: 2.8,
      }}
      style={{ width, height }}
      mapStyle="https://demotiles.maplibre.org/globe.json"
    >
      {urls.map((url, index) => (
        <Source
          key={`${index} ${url}`}
          id={`${index} ${url}`}
          type="raster"
          tiles={[url]}
          tileSize={256}
        >
          <Layer
            id={`${index} ${url}`}
            type="raster"
            paint={{
              "raster-opacity": 1.0,
            }}
          />
        </Source>
      ))}
    </Map>
  );
};

export default MapLibre;
