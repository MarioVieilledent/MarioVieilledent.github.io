import type { ScriptLanguage } from "./arabicAlphabetData";
import lessonData from "./alphabetLessons.json";

export type ReadingWord = {
  script: string;
  latin: string;
  translation: string;
};

export type ReadingLesson = {
  letters: string[];
  words: ReadingWord[];
};

export const lessonsByLanguage: Record<ScriptLanguage, ReadingLesson[]> = lessonData;

// These ASCII keys describe the written letters, not their spoken short vowels.
export const latinLetterByLanguage: Record<ScriptLanguage, Record<string, string>> = {
  arabic: {
    ا: "a", ب: "b", ت: "t", ث: "th", ج: "j", ح: "hh", خ: "kh",
    د: "d", ذ: "dh", ر: "r", ز: "z", س: "s", ش: "sh", ص: "ss",
    ض: "dd", ط: "tt", ظ: "zz", ع: "aa", غ: "gh", ف: "f", ق: "q",
    ك: "k", ل: "l", م: "m", ن: "n", ه: "h", و: "w", ي: "y",
  },
  persian: {
    ا: "a", ب: "b", پ: "p", ت: "t", ث: "th", ج: "j", چ: "ch",
    ح: "hh", خ: "kh", د: "d", ذ: "dh", ر: "r", ز: "z", ژ: "zh",
    س: "s", ش: "sh", ص: "ss", ض: "dd", ط: "tt", ظ: "zz", ع: "aa",
    غ: "gh", ف: "f", ق: "q", ک: "k", گ: "g", ل: "l", م: "m",
    ن: "n", و: "v", ه: "h", ی: "y",
  },
};
