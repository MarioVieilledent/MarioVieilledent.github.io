import { describe, expect, it } from "vitest";
import { hiraganaCourseData, katakanaCourseData } from "./data/japaneseScriptData";
import { kannadaCourseData, malayalamCourseData, tamilCourseData, teluguCourseData } from "./data/southIndianScriptData";
import type { ScriptCourseData } from "./scriptLearningTypes";

const courses: Record<string, { data: ScriptCourseData; letters: number }> = {
  hiragana: { data: hiraganaCourseData, letters: 46 },
  katakana: { data: katakanaCourseData, letters: 46 },
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
        expect(lesson.words.length).toBe(lesson.letters.length * 3);
        lesson.words.forEach((word) => {
          expect(word.script.trim()).not.toBe("");
          expect(word.latin.trim()).not.toBe("");
          expect(word.translation.trim()).not.toBe("");
        });
      }
    });
  });
}

it("romanizes common small and long katakana combinations", () => {
  const words = katakanaCourseData.lessons.flatMap((lesson) => lesson.words);
  expect(words.find((word) => word.script === "シャツ")?.latin).toBe("shatsu");
  expect(words.find((word) => word.script === "フォーク")?.latin).toBe("fooku");
});
