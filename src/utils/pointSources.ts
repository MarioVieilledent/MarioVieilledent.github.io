import type { MapPoint } from "../types/types";

type RawMapPoint = Omit<MapPoint, "color" | "source">;
type PointCategory = "shops" | "sportSites" | "outdoorSites" | "services";

export interface PointSource {
  name: string;
  color: string;
  count: number;
  load: () => Promise<{ default: RawMapPoint[] }>;
  category?: PointCategory;
}

const pointSource = (
  name: string,
  color: string,
  count: number,
  load: PointSource["load"],
  category?: PointCategory,
): PointSource => ({ name, color, count, load, category });

export const pointSources: PointSource[] = [
  pointSource("Public toilets", "#64748b", 3871, () => import("../data/publicToilets.json"), "services"),
  pointSource("Tourist cabins", "#92400e", 966, () => import("../data/touristCabins.json"), "outdoorSites"),
  pointSource("Outdoor shelters", "#a16207", 2606, () => import("../data/outdoorShelters.json"), "outdoorSites"),
  pointSource("DNT cabins and shelters", "#dc2626", 731, () => import("../data/dntSites.json"), "outdoorSites"),
  pointSource("Public bathing places", "#06b6d4", 402, () => import("../data/publicBathingPlaces.json"), "outdoorSites"),
  pointSource("Libraries", "#7c3aed", 715, () => import("../data/libraries.json"), "services"),
  pointSource("Vinmonopolet", "#7a1f3d", 354, () => import("../data/vinmonopoletStores.json")),
  pointSource("Climbing centres", "#f97316", 80, () => import("../data/climbingCentres.json"), "sportSites"),
  pointSource("Athletics tracks", "#e11d48", 613, () => import("../data/athleticsTracks.json"), "sportSites"),
  pointSource("Football fields", "#16a34a", 7240, () => import("../data/footballFields.json"), "sportSites"),
  pointSource("Ski jumps", "#2563eb", 522, () => import("../data/skiJumps.json"), "sportSites"),
  pointSource("Public swimming halls", "#0284c7", 114, () => import("../data/swimmingHalls.json"), "sportSites"),
  pointSource("MENY", "#b91c1c", 183, () => import("../data/menyStores.json")),
  pointSource("REMA 1000", "#00205b", 698, () => import("../data/remaStores.json")),
  pointSource("KIWI", "#00843d", 728, () => import("../data/kiwiStores.json")),
  pointSource("Joker", "#e30613", 436, () => import("../data/jokerStores.json")),
  pointSource("Bunnpris", "#f2c300", 243, () => import("../data/bunnprisStores.json")),
  pointSource("SPAR", "#007a33", 276, () => import("../data/sparStores.json")),
  pointSource("Nærbutikken", "#f58220", 121, () => import("../data/narbutikkenStores.json")),
  pointSource("Extra", "#ffd241", 599, () => import("../data/extraStores.json")),
  pointSource("Coop Prix", "#e30613", 257, () => import("../data/coopPrixStores.json")),
  pointSource("Coop Marked / Matkroken", "#0050ff", 161, () => import("../data/coopMarkedStores.json")),
  pointSource("Coop Mega", "#8c1d40", 61, () => import("../data/coopMegaStores.json")),
  pointSource("Obs", "#ed1b2f", 32, () => import("../data/obsStores.json")),
].sort((a, b) => b.count - a.count);

const loadedPointSources = new Map<string, Promise<MapPoint[]>>();

export const loadPointSource = (source: PointSource): Promise<MapPoint[]> => {
  const cached = loadedPointSources.get(source.name);
  if (cached) return cached;

  const request = source
    .load()
    .then(({ default: points }) =>
      points.map((point) => ({
        ...point,
        color: source.color,
        source: source.name,
      })),
    )
    .catch((error: unknown) => {
      loadedPointSources.delete(source.name);
      throw error;
    });

  loadedPointSources.set(source.name, request);
  return request;
};
