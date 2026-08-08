import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import type { OSMnominatimResponse } from "../../types/types";
import { computeZoomForBoundingBox } from "../../utils/utils";

interface SearchButtonProps {
  flyTo: (lon: number, lat: number, zoom?: number) => void;
}

const SearchButton = ({ flyTo }: SearchButtonProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const query = formData.get("search")?.toString().trim();

    if (query) {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      )
        .then((res) =>
          res.json().then((data: OSMnominatimResponse[]) => {
            if (data.length > 0) {
              flyTo(
                Number(data[0].lon),
                Number(data[0].lat),
                computeZoomForBoundingBox(data[0].boundingbox)
              );
            }
          })
        )
        .catch((e) => console.warn(e));
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`fixed top-4 left-20 z-50 ${
        isFocused ? "w-84 max-w-[calc(100%-10rem)] gap-4" : "w-12"
      } flex h-12 items-center justify-center rounded-full border border-stone-200 bg-white p-4 shadow-lg transition-all duration-200 hover:shadow-xl focus-within:ring-2 focus-within:ring-amber-400`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={() => {
        if (!isFocused) {
          setIsFocused(true);
        }
      }}
    >
      <input
        ref={inputRef}
        className={`${isFocused ? "w-full" : "w-0"} text-stone-800 focus:outline-none`}
        type="text"
        name="search"
        id="search"
        required
      />
      <button
        type="submit"
        className="m-0 shrink-0 border-none bg-transparent p-0 text-stone-600"
        aria-label="Search"
      >
        <LuSearch className="h-6 w-6" />
      </button>
    </form>
  );
};

export default SearchButton;
