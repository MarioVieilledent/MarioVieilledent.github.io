// Shared helpers for keeping a top-level URL search param (i.e. before the
// `#`, outside HashRouter's territory) in sync with app state. Reads go
// through the native URLSearchParams; writes use history.replaceState so
// state changes (language, map layers, ...) never spam browser history, and
// forward the existing history.state so react-router's own state (attached
// to the same history entry) isn't clobbered.

export const getURLParam = (key: string): string | null =>
  new URLSearchParams(window.location.search).get(key);

export const setURLParam = (key: string, value: string | null) => {
  const url = new URL(window.location.href);
  const current = url.searchParams.get(key);

  if (value === null || value === "") {
    if (current === null) return;
    url.searchParams.delete(key);
  } else {
    if (current === value) return;
    url.searchParams.set(key, value);
  }

  window.history.replaceState(window.history.state, "", url);
};
