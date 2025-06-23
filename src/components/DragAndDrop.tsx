import React, { useCallback, useState, type Dispatch } from "react";
import { fitToJSON } from "../utils/garminUtils";
import { useTranslation } from "../utils/TranslationContext";

const DragAndDrop = ({
  setFitFile,
}: {
  setFitFile: Dispatch<React.SetStateAction<any>>;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useTranslation();

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);

      const files = event.dataTransfer.files;
      if (!files.length) return;

      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (result instanceof ArrayBuffer) {
          const bytes = new Uint8Array(result);
          setFitFile(fitToJSON(bytes));
        }
      };

      reader.readAsArrayBuffer(file);
    },
    [setFitFile]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`w-full max-w-md h-48 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-500 transition-colors
        ${
          isDragging
            ? "border-blue-400 bg-blue-50 text-blue-600"
            : "border-gray-300 bg-white hover:bg-gray-50"
        }`}
    >
      {t("dragAndDropFilesHere")}
    </div>
  );
};

export default DragAndDrop;
