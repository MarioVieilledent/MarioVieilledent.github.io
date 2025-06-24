import * as THREE from "three";

export const cartesianToLatLon = (pos: THREE.Vector3): [number, number] => {
  const lat = THREE.MathUtils.radToDeg(Math.asin(pos.y / pos.length()));
  const lon = THREE.MathUtils.radToDeg(Math.atan2(pos.z, pos.x));
  return [lat, lon];
};

export const latLonToTile = (
  lat: number,
  lon: number,
  zoom: number
): { x: number; y: number } => {
  const latRad = (lat * Math.PI) / 180;
  const n = 2 ** zoom;
  const x = Math.floor(((lon + 180) / 360) * n);
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { x, y };
};

export const getZoomLevel = (
  cameraDistance: number,
  baseRadius: number
): number => {
  // Example: closer distance = higher zoom
  const zoom = Math.floor(2 - Math.log2(cameraDistance / baseRadius));
  return THREE.MathUtils.clamp(zoom, 0, 18);
};

export const tileToLatLonBounds = (
  z: number,
  x: number,
  y: number
): { north: number; south: number; west: number; east: number } => {
  const n = Math.pow(2, z);

  const lonDeg = (tileX: number) => (tileX / n) * 360 - 180;
  const latDeg = (tileY: number) => {
    const y = Math.PI - (2 * Math.PI * tileY) / n;
    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(y) - Math.exp(-y)));
  };

  return {
    north: latDeg(y),
    south: latDeg(y + 1),
    west: lonDeg(x),
    east: lonDeg(x + 1),
  };
};

export const latLonToCartesian = (
  lat: number,
  lon: number,
  radius: number = 1
): THREE.Vector3 => {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

export const createTileMesh = (
  z: number,
  x: number,
  y: number,
  texture: THREE.Texture
): THREE.Mesh => {
  const { north, south, west, east } = tileToLatLonBounds(z, x, y);

  const nw = latLonToCartesian(north, west);
  const ne = latLonToCartesian(north, east);
  const sw = latLonToCartesian(south, west);
  const se = latLonToCartesian(south, east);

  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    ...nw.toArray(),
    ...sw.toArray(),
    ...se.toArray(), // Triangle 1
    ...se.toArray(),
    ...ne.toArray(),
    ...nw.toArray(), // Triangle 2
  ]);
  const uvs = new Float32Array([
    0,
    1,
    0,
    0,
    1,
    0, // Triangle 1
    1,
    0,
    1,
    1,
    0,
    1, // Triangle 2
  ]);

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.FrontSide,
  });
  return new THREE.Mesh(geometry, material);
};

export const clamp = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, val));
};
