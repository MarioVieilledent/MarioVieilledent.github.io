import type { MapPoint } from "../types/types";
import bunnprisStores from "../data/bunnprisStores.json";
import coopMarkedStores from "../data/coopMarkedStores.json";
import coopMegaStores from "../data/coopMegaStores.json";
import coopPrixStores from "../data/coopPrixStores.json";
import extraStores from "../data/extraStores.json";
import jokerStores from "../data/jokerStores.json";
import kiwiStores from "../data/kiwiStores.json";
import menyStores from "../data/menyStores.json";
import narbutikkenStores from "../data/narbutikkenStores.json";
import obsStores from "../data/obsStores.json";
import remaStores from "../data/remaStores.json";
import sparStores from "../data/sparStores.json";
import swimmingHalls from "../data/swimmingHalls.json";
import athleticsTracks from "../data/athleticsTracks.json";
import climbingCentres from "../data/climbingCentres.json";
import dntSites from "../data/dntSites.json";
import footballFields from "../data/footballFields.json";
import libraries from "../data/libraries.json";
import outdoorShelters from "../data/outdoorShelters.json";
import publicBathingPlaces from "../data/publicBathingPlaces.json";
import publicToilets from "../data/publicToilets.json";
import skiJumps from "../data/skiJumps.json";
import touristCabins from "../data/touristCabins.json";
import vinmonopoletStores from "../data/vinmonopoletStores.json";

export interface PointSource {
  name: string;
  color: string;
  points: Omit<MapPoint, "color" | "source">[];
  category?: "shops" | "sportSites" | "outdoorSites" | "services";
}

export const pointSources: PointSource[] = [
  {
    name: "Public toilets",
    color: "#64748b",
    points: publicToilets,
    category: "services" as const,
  },
  {
    name: "Tourist cabins",
    color: "#92400e",
    points: touristCabins,
    category: "outdoorSites" as const,
  },
  {
    name: "Outdoor shelters",
    color: "#a16207",
    points: outdoorShelters,
    category: "outdoorSites" as const,
  },
  {
    name: "DNT cabins and shelters",
    color: "#dc2626",
    points: dntSites,
    category: "outdoorSites" as const,
  },
  {
    name: "Public bathing places",
    color: "#06b6d4",
    points: publicBathingPlaces,
    category: "outdoorSites" as const,
  },
  {
    name: "Libraries",
    color: "#7c3aed",
    points: libraries,
    category: "services" as const,
  },
  { name: "Vinmonopolet", color: "#7a1f3d", points: vinmonopoletStores },
  {
    name: "Climbing centres",
    color: "#f97316",
    points: climbingCentres,
    category: "sportSites" as const,
  },
  {
    name: "Athletics tracks",
    color: "#e11d48",
    points: athleticsTracks,
    category: "sportSites" as const,
  },
  {
    name: "Football fields",
    color: "#16a34a",
    points: footballFields,
    category: "sportSites" as const,
  },
  {
    name: "Ski jumps",
    color: "#2563eb",
    points: skiJumps,
    category: "sportSites" as const,
  },
  {
    name: "Public swimming halls",
    color: "#0284c7",
    points: swimmingHalls,
    category: "sportSites" as const,
  },
  { name: "MENY", color: "#b91c1c", points: menyStores },
  { name: "REMA 1000", color: "#00205b", points: remaStores },
  { name: "KIWI", color: "#00843d", points: kiwiStores },
  { name: "Joker", color: "#e30613", points: jokerStores },
  { name: "Bunnpris", color: "#f2c300", points: bunnprisStores },
  { name: "SPAR", color: "#007a33", points: sparStores },
  { name: "Nærbutikken", color: "#f58220", points: narbutikkenStores },
  { name: "Extra", color: "#ffd241", points: extraStores },
  { name: "Coop Prix", color: "#e30613", points: coopPrixStores },
  {
    name: "Coop Marked / Matkroken",
    color: "#0050ff",
    points: coopMarkedStores,
  },
  { name: "Coop Mega", color: "#8c1d40", points: coopMegaStores },
  { name: "Obs", color: "#ed1b2f", points: obsStores },
].sort((a, b) => b.points.length - a.points.length);
