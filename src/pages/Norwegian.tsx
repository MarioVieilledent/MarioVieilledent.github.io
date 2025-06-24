import Section from "../components/Section";
import { words } from "../words";

const Norwegian = () => {
  return (
    <Section>
      <div className="flex-column">
        {words.map((word, index) => (
          <div key={index}>{word.norwegian}</div>
        ))}
      </div>
    </Section>
  );
};

export default Norwegian;
