export type ScriptWord = {
  script: string;
  latin: string;
  translation: string;
};

export type ScriptExample = Omit<ScriptWord, "latin">;

export type ScriptLetter = {
  letter: string;
  name: string;
  transliteration: string;
  sound: string;
  forms: { label: string; glyph: string }[];
  examples: ScriptExample[];
};

export type ScriptLesson = {
  letters: string[];
  words: ScriptWord[];
};

export type ScriptCourseData = {
  alphabet: ScriptLetter[];
  lessons: ScriptLesson[];
};
