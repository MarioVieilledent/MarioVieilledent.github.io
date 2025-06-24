import type { LanguagesAvailable } from "./TranslationContext";

export const LOCAL_STORAGE_ROUTE_KEY = "route";
export const LOCAL_STORAGE_LANGUAGE_KEY = "language";
export const LOCAL_STORAGE_LAYER_KEY = "layer";
export const LOCAL_STORAGE_CENTER_KEY = "center";
export const LOCAL_STORAGE_RESOLUTION_KEY = "resolution";

export const languages: {
  code: LanguagesAvailable;
  name: string;
  index: number;
}[] = [
  {
    code: "en",
    name: "English",
    index: 0,
  },
  {
    code: "nb",
    name: "Norsk",
    index: 1,
  },
  {
    code: "fr",
    name: "Français",
    index: 2,
  },
];

export const knownTileSources: {
  name: string;
  url: string;
  type: string;
  description: string;
}[] = [
  {
    name: "OpenStreetMap Standard",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    type: "general",
    description:
      "Standard OSM map with a balance of roads, land-use, and points of interest. Suitable for general navigation and background use.",
  },
  {
    name: "OpenTopoMap",
    url: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
    type: "topographic",
    description:
      "Topographic map with contour lines, elevation shading, and hiking-related symbols. Ideal for outdoor and hiking applications.",
  },
  {
    name: "ArcGIS World Imagery",
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    type: "satellite",
    description:
      "High-resolution satellite imagery from Esri. Good for background realism or remote sensing overlays.",
  },
  {
    name: "TopPlus Open (Germany)",
    url: "https://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web/default/WEBMERCATOR/{z}/{y}/{x}.png",
    type: "topographic",
    description:
      "Official topographic map of Germany provided by the federal mapping agency. High-quality, focused on German territory.",
  },
  {
    name: "Wanderreitkarte Topo",
    url: "https://topo.wanderreitkarte.de/topo/{z}/{x}/{y}.png",
    type: "topographic",
    description:
      "Topographic map focused on hiking and horseback trails in Europe. Includes contours and route markings.",
  },
  {
    name: "Wanderreitkarte Traditional",
    url: "https://tradi2.wanderreitkarte.de/tradi/{z}/{x}/{y}.png",
    type: "topographic",
    description:
      "Same data as Wanderreitkarte Topo but with a classic hiking map look. Focused on clarity and tradition.",
  },
  {
    name: "Utagawa VTT",
    url: "https://maps.utagawavtt.com/styles/utagawavtt/{z}/{x}/{y}.png",
    type: "outdoor",
    description:
      "OSM-based French outdoor map for hiking and mountain biking. Emphasizes trails, terrain and points of interest.",
  },
  {
    name: "Thunderforest Landscape",
    url: "https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png",
    type: "outdoor",
    description:
      "Detailed natural landscape map including forests, trails, terrain shading. Free with attribution, API key may be needed.",
  },
  {
    name: "LuminoCity WorldPop 2020",
    url: "https://luminocity3d.org/WorldPopDen/tiles2020/{z}/{x}/{y}.png",
    type: "custom",
    description:
      "Overlay showing global population density for 2020. Useful for demographic analysis and visualizing population clusters.",
  },
  {
    name: "FlightConnections",
    url: "https://cdn.flightconnections.com/maptiles/en/{z}/{x}/{y}.png",
    type: "custom",
    description:
      "Stylized base map designed for aviation route visualization. Emphasizes major cities and air travel hubs.",
  },

  {
    name: "Carto Light",
    url: "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    type: "minimal",
    description:
      "Minimal, light grey base map for overlaying custom data. Neutral background, not distracting.",
  },
  {
    name: "Carto Dark",
    url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    type: "minimal",
    description:
      "Dark-themed minimal base map, good for nighttime or dark UI styles. Used often in dashboards or analytics maps.",
  },
  {
    name: "OSM Cyclo",
    url: "https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    type: "cycling",
    description:
      "Map optimized for cyclists. Includes elevation, bike lanes, and cycling infrastructure based on OSM data.",
  },
  {
    name: "OSM Humanitarian (HOT)",
    url: "https://tile-{a-c}.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    type: "humanitarian",
    description:
      "Designed for disaster response and humanitarian mapping. Highlights infrastructure like roads and buildings clearly.",
  },
  {
    name: "Waymarked Trails Hiking",
    url: "https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png",
    type: "overlay",
    description:
      "Overlay showing long-distance hiking trails from OSM data. Use above a base map.",
  },
  {
    name: "Waymarked Trails Cycling",
    url: "https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png",
    type: "overlay",
    description:
      "Overlay showing official and popular cycling routes from OSM. Complements general-purpose maps.",
  },
  {
    name: "Waymarked Trails Skiing",
    url: "https://tile.waymarkedtrails.org/slopes/{z}/{x}/{y}.png",
    type: "overlay",
    description:
      "Overlay showing cross-country skiing trails from OSM. Transparent and suitable for winter-themed maps.",
  },
  {
    name: "OpenRailwayMap",
    url: "https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
    type: "overlay",
    description:
      "Overlay showing railway infrastructure from OSM. Useful in transport/logistics or urban planning.",
  },
  {
    name: "OpenRailwayMap Maxspeed",
    url: "https://tiles.openrailwaymap.org/maxspeed/{z}/{x}/{y}.png",
    type: "overlay",
    description:
      "Overlay of railway speed limits. Transparent and color-coded by speed.",
  },
  {
    name: "OpenRailwayMap Signalling",
    url: "https://tiles.openrailwaymap.org/signals/{z}/{x}/{y}.png",
    type: "overlay",
    description: "Overlay of railway signalling and train protection",
  },
  {
    name: "OpenRailwayMap Electrification",
    url: "https://tiles.openrailwaymap.org/electrification/{z}/{x}/{y}.png",
    type: "overlay",
    description:
      "Transparent overlay showing railway electrification infrastructure.",
  },
  {
    name: "OpenRailwayMap Gauge",
    url: "https://tiles.openrailwaymap.org/gauge/{z}/{x}/{y}.png",
    type: "overlay",
    description: "Transparent overlay showing track gauge.",
  },
  {
    name: "Windy Weather Radar",
    url: "https://tiles-s.windy.com/tiles/v10.0/darkmap/{z}/{x}/{y}.png",
    type: "overlay",
    description:
      "Weather radar data including precipitation. Real-time and transparent.",
  },
];
