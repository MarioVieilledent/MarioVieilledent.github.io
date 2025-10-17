export const computeZoomForBoundingBox = (boundingbox: string[4]): number => {
  const [minLat, maxLat, minLon, maxLon] = boundingbox;

  const latSpan = Math.abs(Number(maxLat) - Number(minLat));
  const lonSpan = Math.abs(Number(maxLon) - Number(minLon));

  // Use the larger span (worst case)
  const degreesSpan = Math.max(latSpan, lonSpan);

  if (degreesSpan <= 0) {
    // fallback if invalid box
    return 18;
  }

  // Approximate zoom: log scale
  const zoom = Math.log2(360 / degreesSpan) + 1.5;

  // Clamp to typical OSM zoom levels
  return Math.max(2, Math.min(18, zoom));
};

export const formatDate = (isoDate: string, language: string) => {
  return new Date(isoDate).toLocaleDateString(language, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ChatGPT generated logic
export const randomIndexBasedOnDate = (n: number): number => {
  if (n <= 0) {
    return 0;
  }

  // Get a date string like "2025-10-17"
  const dateStr = new Date().toISOString().slice(0, 10);

  // Simple hash function to convert date string → deterministic number
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }

  // Use hash to generate a deterministic index in [0, n)
  return hash % n;
};
