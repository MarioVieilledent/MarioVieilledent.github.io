import { describe, expect, it } from "vitest";
import type { CountryType } from "./validator";
import { normalizeCountryAnswer, searchCountries } from "./countrySearch";

const countries: CountryType[] = [
  {
    name: "United Kingdom",
    code: "gb",
    threeLetterCode: "GBR",
    capital: "London",
  },
  {
    name: "Côte d'Ivoire",
    code: "ci",
    threeLetterCode: "CIV",
    capital: "Yamoussoukro",
  },
  {
    name: "Portugal",
    code: "pt",
    threeLetterCode: "PRT",
    capital: "Lisbon",
  },
];

describe("searchCountries", () => {
  it("finds names despite small typos", () => {
    expect(searchCountries(countries, "Portugl")[0].name).toBe("Portugal");
  });

  it("finds fuzzy subsequences and country codes", () => {
    expect(searchCountries(countries, "untd kngdm")[0].name).toBe(
      "United Kingdom",
    );
    expect(searchCountries(countries, "CIV")[0].name).toBe("Côte d'Ivoire");
  });

  it("normalizes accents and punctuation", () => {
    expect(normalizeCountryAnswer("Côte d’Ivoire")).toBe("cote d ivoire");
  });
});
