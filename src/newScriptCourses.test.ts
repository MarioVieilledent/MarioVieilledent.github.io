import { describe, expect, it } from "vitest";
import { hiraganaCourseData, katakanaCourseData, romanizeKana } from "./data/japaneseScriptData";
import { kannadaCourseData, malayalamCourseData, tamilCourseData, teluguCourseData } from "./data/southIndianScriptData";
import type { ScriptCourseData } from "./scriptLearningTypes";

const courses: Record<string, { data: ScriptCourseData; letters: number }> = {
  hiragana: { data: hiraganaCourseData, letters: 71 },
  katakana: { data: katakanaCourseData, letters: 71 },
  tamil: { data: tamilCourseData, letters: 31 },
  telugu: { data: teluguCourseData, letters: 50 },
  kannada: { data: kannadaCourseData, letters: 49 },
  malayalam: { data: malayalamCourseData, letters: 51 },
};

for (const [name, { data, letters }] of Object.entries(courses)) {
  describe(`${name} generated script course`, () => {
    it("has a complete, unique character library with translated examples", () => {
      expect(data.alphabet).toHaveLength(letters);
      expect(new Set(data.alphabet.map((entry) => entry.letter))).toHaveLength(letters);
      for (const entry of data.alphabet) {
        expect(entry.examples).toHaveLength(3);
        expect(entry.forms.length).toBeGreaterThan(0);
        expect(entry.examples.filter((example) => example.script.includes(entry.letter)).length).toBeGreaterThanOrEqual(2);
        entry.examples.forEach((example) => expect(example.translation.trim()).not.toBe(""));
      }
    });

    it("teaches every character once and gives every lesson practice words", () => {
      const taught = data.lessons.flatMap((lesson) => lesson.letters);
      expect(taught).toHaveLength(letters);
      expect(new Set(taught)).toHaveLength(letters);
      for (const lesson of data.lessons) {
        expect(lesson.letters.length).toBeGreaterThan(0);
        expect(lesson.letters.length).toBeLessThanOrEqual(5);
        expect(lesson.words.length).toBeGreaterThan(0);
        lesson.words.forEach((word) => {
          expect(word.script.trim()).not.toBe("");
          expect(word.latin.trim()).not.toBe("");
          expect(word.translation.trim()).not.toBe("");
        });
      }
    });
  });
}

describe.each([
  ["hiragana", hiraganaCourseData],
  ["katakana", katakanaCourseData],
] as const)("%s progressive lessons", (_name, data) => {
  it("uses only kana introduced in the current or earlier rows", () => {
    const known = new Set<string>();
    for (const lesson of data.lessons) {
      lesson.letters.forEach((letter) => known.add(letter));
      expect(lesson.words).toHaveLength(10);
      for (const word of lesson.words) {
        expect(Array.from(word.script).every((character) => known.has(character)), `untaught kana in ${word.script}`).toBe(true);
        expect(Array.from(word.script).some((character) => lesson.letters.includes(character)), `no new kana in ${word.script}`).toBe(true);
      }
    }
  });
});

it("romanizes common small and long katakana combinations", () => {
  expect(romanizeKana("シャツ")).toBe("shatsu");
  expect(romanizeKana("フォーク")).toBe("fooku");
});
