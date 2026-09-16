import ScriptLearningPage, { type ScriptCourseConfig } from "../components/script/ScriptLearningPage";
import courseData from "../data/hindiScriptData.json";

const config: ScriptCourseConfig = {
  id: "hindi-devanagari",
  language: "Hindi",
  nativeName: "हिन्दी · देवनागरी",
  languageCode: "hi",
  direction: "ltr",
  title: "Learn",
  titleAccent: "Devanagari",
  eyebrow: "Akshara path",
  description: "Follow the rhythm of Hindi writing: meet every vowel and consonant, build reading confidence four letters at a time, and train your eye with quick recognition practice.",
  libraryDescription: "Read from left to right. Open a card to see the independent letter, its vowel sign where applicable, and three common Hindi examples.",
  formNote: "Hindi vowels have independent forms and dependent signs called matras. A bare consonant carries an inherent a unless a vowel sign or halant changes it.",
  readingNote: "Type the pronunciation shown in simple Latin letters. Matras are learned with their matching independent vowel; conjuncts combine consonants you already know.",
  quizTip: "The headline joins letters into a continuous visual rhythm. Watch the marks above, below, before, and after each consonant.",
  footerNote: "Devanagari is written from left to right. Hindi uses dependent vowel signs, an inherent vowel, and joined consonant forms; browser speech provides optional audio when a Hindi voice is installed.",
  motif: "rangoli",
  theme: {
    dark: "#7c2d12",
    deep: "#9a3412",
    primary: "#c2410c",
    mid: "#fb923c",
    pale: "#fed7aa",
    tint: "#fff7ed",
    accent: "#fbbf24",
    accentSoft: "#fef3c7",
    paper: "#fffbeb",
  },
  highlightForms: {
    आ: ["ा"], इ: ["ि"], ई: ["ी"], उ: ["ु"], ऊ: ["ू"], ऋ: ["ृ", "ॄ"],
    ए: ["े"], ऐ: ["ै"], ओ: ["ो"], औ: ["ौ"], "अं": ["ं", "ँ"], "अः": ["ः"],
  },
  sources: (
    <>
      Commonness was ranked with the <a className="underline hover:text-[var(--script-primary)]" href="https://github.com/rspeer/wordfreq">wordfreq multilingual frequency data</a>. Romanizations and English meanings were adapted from the <a className="underline hover:text-[var(--script-primary)]" href="https://kaikki.org/dictionary/Hindi/">Kaikki Hindi dictionary</a>, extracted from Wiktionary under CC BY-SA.
    </>
  ),
};

export default function Devanagari() {
  return <ScriptLearningPage data={courseData} config={config} />;
}
