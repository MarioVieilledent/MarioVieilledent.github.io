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

export interface PointSource {
  name: string;
  color: string;
  points: Omit<MapPoint, "color" | "source">[];
}

export const pointSources: PointSource[] = [
  { name: "MENY", color: "#b91c1c", points: menyStores },
  { name: "REMA 1000", color: "#00205b", points: remaStores },
  { name: "KIWI", color: "#00843d", points: kiwiStores },
  { name: "Joker", color: "#e30613", points: jokerStores },
  { name: "Bunnpris", color: "#f2c300", points: bunnprisStores },
  { name: "SPAR", color: "#007a33", points: sparStores },
  { name: "Nærbutikken", color: "#f58220", points: narbutikkenStores },
  { name: "Extra", color: "#ffd241", points: extraStores },
  { name: "Coop Prix", color: "#e30613", points: coopPrixStores },
  { name: "Coop Marked / Matkroken", color: "#0050ff", points: coopMarkedStores },
  { name: "Coop Mega", color: "#8c1d40", points: coopMegaStores },
  { name: "Obs", color: "#ed1b2f", points: obsStores },
].sort((a, b) => b.points.length - a.points.length);
