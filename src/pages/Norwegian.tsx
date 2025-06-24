import { words } from "../words";

const Norwegian = () => {
  return (
    <div className="flex-column">
      {words.map((word, index) => (
        <div key={index}>{word.norwegian}</div>
      ))}
    </div>
  );
};

export default Norwegian;
