import { describe, expect, it } from "vitest";
import hindi from "./data/hindiScriptData.json";
import georgian from "./data/georgianScriptData.json";
import armenian from "./data/armenianScriptData.json";
import hebrew from "./data/hebrewScriptData.json";
import type { ScriptCourseData } from "./scriptLearningTypes";

type CourseRules = {
  data: ScriptCourseData;
  variants: Record<string, string>;
  ignored: Set<string>;
  compounds: string[];
};

const courses: Record<string, CourseRules> = {
  hindi: {
    data: hindi,
    variants: {
      "ा": "आ", "ि": "इ", "ी": "ई", "ु": "उ", "ू": "ऊ", "ृ": "ऋ", "ॄ": "ऋ",
      "े": "ए", "ै": "ऐ", "ो": "ओ", "ौ": "औ", "ं": "अं", "ँ": "अं", "ः": "अः",
    },
    ignored: new Set(["्", "़", "ऽ"]),
    compounds: ["ड़", "ढ़", "अं", "अः"],
  },
  georgian: {
    data: georgian,
    variants: {},
    ignored: new Set(),
    compounds: [],
  },
  armenian: {
    data: armenian,
    variants: { "եւ": "և" },
    ignored: new Set(["՛", "՜", "՞", "՚", "՟"]),
    compounds: ["ու", "և", "եւ"],
  },
  hebrew: {
    data: hebrew,
    variants: { "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ" },
    ignored: new Set("ְֱֲֳִֵֶַָׇֹֺֻּֽֿׁׂׅׄ"),
    compounds: [],
  },
};

const tokenize = (word: string, rules: CourseRules) => {
  const result: string[] = [];
  const compounds = [...rules.compounds].sort((a, b) => b.length - a.length);
  for (let index = 0; index < word.length;) {
    const compound = compounds.find((item) => word.startsWith(item, index));
    if (compound) {
      result.push(rules.variants[compound] ?? compound);
      index += compound.length;
      continue;
    }
    const character = String.fromCodePoint(word.codePointAt(index)!);
    index += character.length;
    if (!rules.ignored.has(character)) result.push(rules.variants[character] ?? character);
  }
  return result;
};

for (const [language, rules] of Object.entries(courses)) {
  describe(`${language} script course`, () => {
    const alphabet = new Set(rules.data.alphabet.map((letter) => letter.letter));

    it("presents every letter once with three translated examples", () => {
      expect(alphabet.size).toBe(rules.data.alphabet.length);
      for (const letter of rules.data.alphabet) {
        expect(letter.examples).toHaveLength(3);
        for (const example of letter.examples) {
          expect(example.script.trim()).not.toBe("");
          expect(example.translation.trim()).not.toBe("");
        }
      }
    });

    it("introduces every letter once in groups of two to four", () => {
      const taught = rules.data.lessons.flatMap((lesson) => lesson.letters);
      expect(rules.data.lessons[0].letters).toHaveLength(4);
      expect(new Set(taught)).toEqual(alphabet);
      expect(taught).toHaveLength(alphabet.size);
      for (const lesson of rules.data.lessons) {
        expect(lesson.letters.length).toBeGreaterThanOrEqual(2);
        expect(lesson.letters.length).toBeLessThanOrEqual(4);
      }
    });

    it("has five increasingly long sets of ten valid practice words per lesson", () => {
      const seen = new Set<string>();
      for (const lesson of rules.data.lessons) {
        const newLetters = new Set(lesson.letters);
        lesson.letters.forEach((letter) => seen.add(letter));
        expect(lesson.words).toHaveLength(50);
        const lengths = lesson.words.map((word) => tokenize(word.script, rules).length);
        expect(lengths).toEqual([...lengths].sort((a, b) => a - b));
        for (const word of lesson.words) {
          const letters = tokenize(word.script, rules);
          expect(letters.every((letter) => seen.has(letter))).toBe(true);
          expect(letters.some((letter) => newLetters.has(letter))).toBe(true);
          expect(word.latin).toMatch(/^[a-z]+$/);
          expect(word.translation.trim()).not.toBe("");
        }
        for (const letter of newLetters) {
          expect(lesson.words.filter((word) => tokenize(word.script, rules).includes(letter)).length).toBeGreaterThanOrEqual(5);
        }
      }
    });
  });
}
