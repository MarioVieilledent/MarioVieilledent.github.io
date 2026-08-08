import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TranslationProvider } from "./components/TranslationProvider.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <TranslationProvider>
        <App />
      </TranslationProvider>
    </ErrorBoundary>
  </StrictMode>
);
