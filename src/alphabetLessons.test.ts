import { describe, expect, it } from "vitest";
import { alphabetByLanguage, type ScriptLanguage } from "./arabicAlphabetData";
import { latinLetterByLanguage, lessonsByLanguage } from "./alphabetLessons";

const variants: Record<ScriptLanguage, Record<string, string>> = {
  arabic: { أ: "ا", إ: "ا", آ: "ا" },
  persian: { آ: "ا" },
};

const variantLatin: Record<ScriptLanguage, Record<string, string>> = {
  arabic: { أ: "a", إ: "i", آ: "aa" },
  persian: { آ: "aa" },
};

for (const language of ["arabic", "persian"] as const) {
  describe(`${language} reading lessons`, () => {
    const lessons = lessonsByLanguage[language];
    const alphabet = new Set(alphabetByLanguage[language].map((letter) => letter.letter));

    it("introduces every alphabet letter exactly once, starting with four", () => {
      const taught = lessons.flatMap((lesson) => lesson.letters);
      expect(lessons[0].letters).toHaveLength(4);
      expect(new Set(taught).size).toBe(alphabet.size);
      expect(new Set(taught)).toEqual(alphabet);
      for (const lesson of lessons.slice(1)) {
        expect(lesson.letters.length).toBeGreaterThanOrEqual(2);
        expect(lesson.letters.length).toBeLessThanOrEqual(4);
      }
    });

    it("has 50 unique words per lesson, ordered by length, with no unseen letters", () => {
      const seenLetters = new Set<string>();
      const seenWords = new Set<string>();
      for (const lesson of lessons) {
        const newLetters = new Set(lesson.letters);
        lesson.letters.forEach((letter) => seenLetters.add(letter));
        expect(lesson.words).toHaveLength(50);
        const lengths = lesson.words.map((word) => Array.from(word.script).length);
        expect(lengths).toEqual([...lengths].sort((a, b) => a - b));
        for (const word of lesson.words) {
          expect(seenWords.has(word.script)).toBe(false);
          seenWords.add(word.script);
          const writtenLetters = Array.from(word.script).map((letter) => variants[language][letter] ?? letter);
          expect(writtenLetters.every((letter) => seenLetters.has(letter))).toBe(true);
          expect(writtenLetters.some((letter) => newLetters.has(letter))).toBe(true);
          const latin = Array.from(word.script)
            .map((letter) => variantLatin[language][letter] ?? latinLetterByLanguage[language][letter])
            .join("");
          expect(word.latin).toBe(latin);
          expect(word.latin).toMatch(/^[a-z]+$/);
          expect(word.translation.trim()).not.toBe("");
          expect(word.translation).toMatch(/^[\x20-\x7e]+$/);
        }
        for (const newLetter of newLetters) {
          const appearances = lesson.words.filter((word) =>
            Array.from(word.script).some((letter) => (variants[language][letter] ?? letter) === newLetter),
          ).length;
          expect(appearances).toBeGreaterThanOrEqual(5);
        }
      }
    });
  });
}
