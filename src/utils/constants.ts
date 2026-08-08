export const LOCAL_STORAGE_LANGUAGE_KEY = "language";
export const LOCAL_STORAGE_LAYERS_KEY = "layer";
export const LOCAL_STORAGE_CENTER_KEY = "center";
export const LOCAL_STORAGE_ZOOM_KEY = "zoom";
export const LOCAL_STORAGE_VIEW_KEY = "view";

export const LANGUAGE_QUERY_PARAM = "lang";
export const VIEW_QUERY_PARAM = "view";
export const BASE_LAYER_QUERY_PARAM = "base";
export const LAYERS_QUERY_PARAM = "layers";
export const CENTER_QUERY_PARAM = "center";
export const ZOOM_QUERY_PARAM = "zoom";

// Shared look for the circular floating action buttons scattered over the
// map (menu, layers, globe toggle, reset rotation, ...). Split in two so
// plain (non-Float) buttons can opt into the same hover/press feedback Float
// already adds automatically to its own trigger buttons.
export const FLOATING_BUTTON_BASE =
  "w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:shadow-xl";
export const FLOATING_BUTTON_INTERACTIVE =
  "transition-all duration-150 hover:scale-105 active:scale-95";
