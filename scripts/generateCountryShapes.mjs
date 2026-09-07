import { readFile, writeFile } from "node:fs/promises";

const SOURCE_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson";

const countries = JSON.parse(
  await readFile(new URL("../public/countries.json", import.meta.url), "utf8"),
).filter((country) => country.threeLetterCode);

const response = await fetch(SOURCE_URL);
if (!response.ok) {
  throw new Error(`Natural Earth download failed: ${response.status}`);
}

const geoJson = await response.json();
const featuresByCode = new Map();

for (const feature of geoJson.features) {
  const codes = [
    feature.properties.ADM0_A3,
    feature.properties.ISO_A3,
    feature.properties.SU_A3,
  ];

  for (const code of codes) {
    if (code && code !== "-99" && !featuresByCode.has(code)) {
      featuresByCode.set(code, feature);
    }
  }
}

const unwrapRing = (ring) => {
  if (ring.length === 0) return ring;

  const result = [[ring[0][0], ring[0][1]]];
  for (let index = 1; index < ring.length; index += 1) {
    let longitude = ring[index][0];
    const previousLongitude = result[index - 1][0];

    while (longitude - previousLongitude > 180) longitude -= 360;
    while (longitude - previousLongitude < -180) longitude += 360;
    result.push([longitude, ring[index][1]]);
  }

  return result;
};

const polygonArea = (polygon) => {
  const ring = polygon[0] ?? [];
  return Math.abs(
    ring.reduce((area, point, index) => {
      const next = ring[(index + 1) % ring.length];
      return area + point[0] * next[1] - next[0] * point[1];
    }, 0) / 2,
  );
};

const polygonCenter = (polygon) => {
  const points = polygon.flat();
  return points.reduce((sum, point) => sum + point[0], 0) / points.length;
};

const preparePolygons = (geometry, countryCode) => {
  let coordinates =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

  // Natural Earth's country-level France geometry includes far-flung overseas
  // departments. Keep metropolitan France and Corsica so the silhouette remains
  // useful in a country-outline quiz.
  if (countryCode === "FRA") {
    coordinates = coordinates.filter((polygon) => {
      const ring = polygon[0];
      const longitude = ring.reduce((sum, point) => sum + point[0], 0) / ring.length;
      const latitude = ring.reduce((sum, point) => sum + point[1], 0) / ring.length;
      return longitude > -10 && longitude < 15 && latitude > 40 && latitude < 55;
    });
  }
  const polygons = coordinates.map((polygon) => polygon.map(unwrapRing));
  const anchor = polygons.reduce((largest, polygon) =>
    polygonArea(polygon) > polygonArea(largest) ? polygon : largest,
  );
  const anchorCenter = polygonCenter(anchor);

  return polygons.map((polygon) => {
    const center = polygonCenter(polygon);
    const offset = Math.round((anchorCenter - center) / 360) * 360;
    return polygon.map((ring) =>
      ring.map(([longitude, latitude]) => [longitude + offset, latitude]),
    );
  });
};

const toSvgPath = (geometry, countryCode) => {
  const polygons = preparePolygons(geometry, countryCode);
  const points = polygons.flat(2);
  const minLatitude = Math.min(...points.map((point) => point[1]));
  const maxLatitude = Math.max(...points.map((point) => point[1]));
  const middleLatitude = (minLatitude + maxLatitude) / 2;
  const longitudeScale = Math.max(
    Math.cos((middleLatitude * Math.PI) / 180),
    0.2,
  );
  const projected = polygons.map((polygon) =>
    polygon.map((ring) =>
      ring.map(([longitude, latitude]) => [
        longitude * longitudeScale,
        -latitude,
      ]),
    ),
  );
  const projectedPoints = projected.flat(2);
  const minX = Math.min(...projectedPoints.map((point) => point[0]));
  const maxX = Math.max(...projectedPoints.map((point) => point[0]));
  const minY = Math.min(...projectedPoints.map((point) => point[1]));
  const maxY = Math.max(...projectedPoints.map((point) => point[1]));
  const scale = Math.min(
    172 / Math.max(maxX - minX, 0.001),
    112 / Math.max(maxY - minY, 0.001),
  );
  const offsetX = 100 - ((minX + maxX) / 2) * scale;
  const offsetY = 70 - ((minY + maxY) / 2) * scale;
  const format = (value) => Number(value.toFixed(1));

  return projected
    .map((polygon) =>
      polygon
        .map(
          (ring) =>
            ring
              .map(
                ([x, y], index) =>
                  `${index === 0 ? "M" : "L"}${format(x * scale + offsetX)} ${format(y * scale + offsetY)}`,
              )
              .join("") + "Z",
        )
        .join(""),
    )
    .join("");
};

const shapes = Object.fromEntries(
  countries.map((country) => {
    const feature = featuresByCode.get(country.threeLetterCode);
    if (!feature) throw new Error(`No boundary found for ${country.name}`);
    return [
      country.threeLetterCode,
      toSvgPath(feature.geometry, country.threeLetterCode),
    ];
  }),
);

await writeFile(
  new URL("../public/country-shapes.json", import.meta.url),
  `${JSON.stringify(
    {
      source: {
        name: "Natural Earth Admin 0 – Countries",
        url: "https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/",
        license: "Public domain",
        scale: "1:50m",
      },
      shapes,
    },
    null,
    2,
  )}\n`,
);

console.log(`Generated ${Object.keys(shapes).length} country outlines.`);
