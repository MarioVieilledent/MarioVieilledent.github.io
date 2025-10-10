import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import z from "zod";
import { countryType, type CountryType } from "../utils/validator";
import FlagCard from "../components/flags/FlagCard";
import Home from "../components/Home";

type Charact = { name: string; show: boolean };

const discoverCharacteristics = (data: CountryType[]): Charact[] => {
  const chars: Charact[] = [];

  data.forEach((country) => {
    if (country.flagCharacteristics && country.flagCharacteristics.length > 0) {
      country.flagCharacteristics.forEach((char) => {
        if (!chars.map((c) => c.name).includes(char)) {
          chars.push({ name: char, show: false });
        }
      });
    }
  });
  return chars;
};

const Flags = () => {
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [characteristics, setCharacteristics] = useState<Charact[]>([]);

  useEffect(() => {
    fetch("/countries.json")
      .then((response) => response.json())
      .then((data: unknown) => {
        const parsedData = z.array(countryType).parse(data);
        setCountries(parsedData);
        setCharacteristics(discoverCharacteristics(parsedData));
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  return (
    <PageWrapper>
      <div>
        <Home />
        <div className="flex flex-wrap gap-x-4">
          {characteristics.map((characteristic, index) => (
            <div key={index} className="flex gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={characteristic.show}
                id={characteristic.name}
                onChange={(e) => {
                  const idx = characteristics.findIndex(
                    (c) => c.name === characteristic.name
                  );
                  if (idx) {
                    const newElem = JSON.parse(JSON.stringify(characteristics));
                    newElem[idx].show = e.target.checked;
                    setCharacteristics(newElem);
                  }
                }}
              />
              <label htmlFor={characteristic.name}>{characteristic.name}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {countries
          .filter((c) => c.threeLetterCode)
          .filter(
            (c) =>
              c.flagCharacteristics?.reduce(
                (acc, char) =>
                  acc ||
                  characteristics
                    .filter((c) => c.show)
                    .map((c) => c.name)
                    .includes(char),
                false
              ) ?? true
          )
          .map((country, index) => (
            <FlagCard key={index} country={country} />
          ))}
      </div>
    </PageWrapper>
  );
};

export default Flags;
