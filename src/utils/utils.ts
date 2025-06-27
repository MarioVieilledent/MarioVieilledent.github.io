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
