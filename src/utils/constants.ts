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

export const layers = {
  OSM: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  OSMCycle:
    "https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  OSMHot: "https://tile-{a-c}.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  OpenTopoMap: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
  CartoLight:
    "https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  CartoDark:
    "  https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  ArcGIS:
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  WandereitkartTopo: "https://topo.wanderreitkarte.de/topo/{z}/{x}/{y}.png",
  WandereitkartTradi: "https://tradi2.wanderreitkarte.de/tradi/{z}/{x}/{y}.png",
  Utagawavtt: "https://maps.utagawavtt.com/styles/utagawavtt/{z}/{x}/{y}.png",
  Thunderforest: "https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png",
};
