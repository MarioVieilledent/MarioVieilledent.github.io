import ScriptLearningPage, { type ScriptCourseConfig } from "../components/script/ScriptLearningPage";
import courseData from "../data/hebrewScriptData.json";

const config: ScriptCourseConfig = {
  id: "modern-hebrew",
  language: "Hebrew",
  nativeName: "עברית · אלף־בית",
  languageCode: "he",
  direction: "rtl",
  title: "Learn the",
  titleAccent: "Hebrew alphabet",
  eyebrow: "Alef-bet studio",
  description: "Move through the alef-bet from right to left, meet every regular and final letter form, read useful Modern Hebrew words, and build fast visual recognition.",
  libraryDescription: "Hebrew is read from right to left. Open a card for pronunciation, final forms where they exist, and three frequent Modern Hebrew examples.",
  formNote: "Five Hebrew letters take a special final form at the end of a word: ך, ם, ן, ף, and ץ. They are forms of the same base letters, not extra alphabet entries.",
  readingNote: "Type the word's spoken form in simple Latin letters. Modern everyday text is usually unvocalized, so the same letter can participate in different vowel patterns.",
  quizTip: "Final letters can look taller or drop below the line. They still answer to the same base-letter card shown among the choices.",
  footerNote: "This course uses unvocalized Modern Hebrew and a simple pronunciation-based Latin transcription. Optional audio depends on a Hebrew voice installed in your browser.",
  motif: "magen-david",
  theme: {
    dark: "#172554",
    deep: "#1e3a8a",
    primary: "#1d4ed8",
    mid: "#60a5fa",
    pale: "#bfdbfe",
    tint: "#eff6ff",
    accent: "#fbbf24",
    accentSoft: "#fef3c7",
    paper: "#f8fafc",
  },
  highlightForms: { כ: ["ך"], מ: ["ם"], נ: ["ן"], פ: ["ף"], צ: ["ץ"] },
  sources: (
    <>
      Commonness was ranked with the <a className="underline hover:text-[var(--script-primary)]" href="https://github.com/rspeer/wordfreq">wordfreq multilingual frequency data</a>. Romanizations and English meanings were adapted from the <a className="underline hover:text-[var(--script-primary)]" href="https://kaikki.org/dictionary/Hebrew/">Kaikki Hebrew dictionary</a>, extracted from Wiktionary under CC BY-SA. Transliteration choices follow modern Israeli pronunciation.
    </>
  ),
};

export default function HebrewAlphabet() {
  return <ScriptLearningPage data={courseData} config={config} />;
}
