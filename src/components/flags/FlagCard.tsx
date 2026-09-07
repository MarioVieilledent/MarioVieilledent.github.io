import type { CountryType } from "../../utils/validator";

const FlagCard = ({ country }: { country: CountryType }) => {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex h-28 items-center justify-center">
        <img
          className="max-h-24 w-full rounded-lg object-contain"
          src={`/flags/${country.code}.svg`}
          alt={`Flag of ${country.name}`}
          loading="lazy"
        />
      </div>
      <span className="mt-2 truncate text-xs text-stone-600" title={country.name}>
        {country.name}
      </span>
    </article>
  );
};

export default FlagCard;
