import { useState } from "react";
import duckLogo from "/favicon.png";
import { languages, useTranslation } from "../components/translations";
import OLMap from "../OLMap";

const Home = () => {
  const { t, setLanguage } = useTranslation();
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        {languages.map((lang) => (
          <button key={lang.code} onClick={() => setLanguage(lang.code)}>
            {lang.name}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <img className="w-8 h-8" src={duckLogo} alt="Duck logo" />
        <h1>{t("title")}</h1>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <div className="w-100 h-100 bg-red-100">
        <OLMap />
      </div>
    </>
  );
};
export default Home;
