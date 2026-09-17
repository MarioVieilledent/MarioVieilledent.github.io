import { describe, expect, it } from "vitest";
import {
  acceptedNorwegianQuizAnswers,
  isNorwegianQuizAnswerCorrect,
} from "./norwegianAnswers";

describe("Norwegian quiz answers", () => {
  it("requires a complete answer instead of accepting substrings", () => {
    expect(isNorwegianQuizAnswerCorrect("ri", "river")).toBe(false);
    expect(isNorwegianQuizAnswerCorrect("river", "river")).toBe(true);
  });

  it("accepts comma and slash separated alternatives", () => {
    expect(isNorwegianQuizAnswerCorrect("lovely", "gorgeous, lovely")).toBe(true);
    expect(isNorwegianQuizAnswerCorrect("tape", "Teip/tape (en)")).toBe(true);
  });

  it("ignores Norwegian noun and infinitive markers", () => {
    expect(isNorwegianQuizAnswerCorrect("postkasse", "Postkasse (en)")).toBe(true);
    expect(isNorwegianQuizAnswerCorrect("påføre", "Å påføre")).toBe(true);
  });

  it("expands optional suffixes", () => {
    expect(acceptedNorwegianQuizAnswers("Smertefull(t)")).toEqual([
      "smertefull",
      "smertefullt",
    ]);
  });
});
