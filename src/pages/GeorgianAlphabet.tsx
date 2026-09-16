import ScriptLearningPage, { type ScriptCourseConfig } from "../components/script/ScriptLearningPage";
import courseData from "../data/georgianScriptData.json";

const config: ScriptCourseConfig = {
  id: "georgian-mkhedruli",
  language: "Georgian",
  nativeName: "ქართული · მხედრული",
  languageCode: "ka",
  direction: "ltr",
  title: "Learn the",
  titleAccent: "Georgian script",
  eyebrow: "Kartuli garden",
  description: "Discover the flowing circles of Mkhedruli, grow from familiar letters into real Georgian words, and sharpen recognition through short, focused practice.",
  libraryDescription: "Modern Georgian is read from left to right and has no everyday upper/lowercase distinction. Each card pairs Mkhedruli with its Mtavruli display form.",
  formNote: "Mkhedruli is the standard form used in ordinary Georgian writing. Mtavruli is a matching title and display form—not grammatical uppercase.",
  readingNote: "Type the pronunciation in simple Latin letters. Apostrophes in formal transliteration mark ejective sounds, but this exercise omits punctuation for easier typing.",
  quizTip: "Many Georgian letters share circles and vertical strokes. Compare the direction of each loop and the height of its stem.",
  footerNote: "Georgian Mkhedruli is a left-to-right, unicameral script with 33 modern letters. Optional pronunciation uses a Georgian voice installed in your browser.",
  motif: "vine",
  theme: {
    dark: "#4c0519",
    deep: "#881337",
    primary: "#9f1239",
    mid: "#e11d48",
    pale: "#fecdd3",
    tint: "#fff1f2",
    accent: "#fbbf24",
    accentSoft: "#fef3c7",
    paper: "#fffaf5",
  },
  sources: (
    <>
      Vocabulary ranking, English glosses, and transliterations use the <a className="underline hover:text-[var(--script-primary)]" href="https://easygeorgian.com/spoken-georgian-frequency/">EasyGeorgian Spoken Georgian Frequency List</a> (CC BY 4.0). Additional meanings and forms were checked against the <a className="underline hover:text-[var(--script-primary)]" href="https://kaikki.org/dictionary/Georgian/">Kaikki Georgian dictionary</a>, extracted from Wiktionary under CC BY-SA.
    </>
  ),
};

export default function GeorgianAlphabet() {
  return <ScriptLearningPage data={courseData} config={config} />;
}
