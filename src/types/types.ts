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
  boundingbox: string[4];
}

export interface Source {
  name: string;
  url: string;
  type: string;
  description: string;
  defaultBaseMap?: boolean;
  defaultOverlay?: boolean;
}
