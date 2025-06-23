import { useState } from "react";
import DragAndDrop from "../components/DragAndDrop";

const Home = () => {
  const [fitFile, setFitFile] = useState<any>(null);

  return (
    <div className="flex-col">
      <DragAndDrop setFitFile={setFitFile} />
      {fitFile === null ? (
        <span>Drag & drop a fit file to see more</span>
      ) : (
        <pre>{JSON.stringify(fitFile, null, 4)}</pre>
      )}
    </div>
  );
};

export default Home;
