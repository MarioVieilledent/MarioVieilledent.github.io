import type { CountryType } from "../../utils/validator";

const FlagCard = ({ country }: { country: CountryType }) => {
  return (
    <div className="flex w-40 flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <img
        className="rounded-lg"
        src={`/flags/${country.code}.svg`}
        alt={`${country.name} flag svg`}
      />
      <span
        className="truncate text-xs text-stone-600"
        title={country.name}
      >
        {country.name}
      </span>
    </div>
  );
};

export default FlagCard;
