import type { CountryType } from "../../utils/validator";

const FlagCard = ({ country }: { country: CountryType }) => {
  return (
    <div className="flex flex-col w-40 gap-1 p-4 bg-gray-200">
      <img
        src={`/flags/${country.code}.svg`}
        alt={`${country.name} flag svg`}
      />
      <span className="text-xs truncate" title={country.name}>
        {country.name}
      </span>
    </div>
  );
};

export default FlagCard;
