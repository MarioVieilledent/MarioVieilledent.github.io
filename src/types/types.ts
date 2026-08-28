export interface OSMnominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: [string, string, string, string];
}

export interface Source {
  name: string;
  url: string;
  type: string;
  description: string;
  defaultSelectedLayers?: boolean;
  // Set when the tile server sends no CORS headers, so the tiles work as
  // plain <img> elements in the 2D (OpenLayers/canvas) renderer but are
  // blocked by the browser when the 3D (MapLibre/WebGL) renderer tries to
  // fetch them as textures. There's no client-side fix for this — it
  // requires the server itself to opt in via Access-Control-Allow-Origin.
  unsupportedIn3D?: boolean;
}

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  postalCode: string;
  city: string;
  url: string;
  color: string;
  source: string;
}
