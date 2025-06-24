import { useState } from "react";
import DragAndDrop from "../components/DragAndDrop";
import Section from "../components/Section";

const Home = () => {
  const [fitFile, setFitFile] = useState<any>(null);

  return (
    <Section>
      <div className="flex-col">
        <DragAndDrop setFitFile={setFitFile} />
        {fitFile === null ? (
          <span>Drag & drop a fit file to see more</span>
        ) : (
          <pre>{JSON.stringify(fitFile, null, 4)}</pre>
        )}
      </div>
    </Section>
  );
};

export default Home;
