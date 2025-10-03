import type { Feast } from "../pages/Recipes";

const FeastDisplay = ({ feast }: { feast: Feast }) => {
  return (
    <div>
      <span>{feast.countryCode}</span>
    </div>
  );
};

export default FeastDisplay;
