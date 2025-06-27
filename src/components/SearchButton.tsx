import { LuSearch } from "react-icons/lu";

const SearchButton = () => {
  const handleSearch = (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const query = formData.get("search")?.toString().trim();

    if (query) {
      console.log("Searching for:", query);
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      )
        .then((res) => res.json().then((data) => console.log(data)))
        .catch((e) => console.warn(e));
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="fixed top-4 left-20 z-50 w-60 h-12 p-4 gap-4 rounded-full bg-white flex items-center shadow-lg transition"
    >
      <input
        className="w-full focus:outline-none"
        type="text"
        name="search"
        id="search"
        required
      />
      <button
        type="submit"
        className="p-0 m-0 bg-transparent border-none"
        aria-label="Search"
      >
        <LuSearch className="w-6 h-6" />
      </button>
    </form>
  );
};

export default SearchButton;
