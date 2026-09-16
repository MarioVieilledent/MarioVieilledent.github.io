import ScriptLearningPage, { type ScriptCourseConfig } from "../components/script/ScriptLearningPage";
import courseData from "../data/armenianScriptData.json";

const config: ScriptCourseConfig = {
  id: "eastern-armenian",
  language: "Armenian",
  nativeName: "Հայերեն · այբուբեն",
  languageCode: "hy",
  direction: "ltr",
  title: "Learn the",
  titleAccent: "Armenian alphabet",
  eyebrow: "Aybuben journey",
  description: "Trace a script shaped by carved stone and handwritten curves: explore the modern Eastern Armenian alphabet, read real words step by step, and practise recognition.",
  libraryDescription: "Armenian runs from left to right and has distinct lowercase and uppercase forms. Open each card for its sound and three familiar examples.",
  formNote: "The course follows modern reformed Eastern Armenian as used in Armenia. Lowercase is used in ordinary text; uppercase begins sentences and proper names.",
  readingNote: "Type the pronunciation in simple Latin letters. Apostrophes used for aspirated sounds in scholarly systems are omitted here for comfortable keyboard practice.",
  quizTip: "Small hooks, loops, and stem direction distinguish several Armenian letters. Compare the whole silhouette before answering.",
  footerNote: "This course follows modern Eastern Armenian pronunciation and reformed spelling, including ու and և as alphabet letters. Optional audio depends on an Armenian browser voice.",
  motif: "eternity",
  theme: {
    dark: "#7f1d1d",
    deep: "#991b1b",
    primary: "#b91c1c",
    mid: "#f97316",
    pale: "#fed7aa",
    tint: "#fff7ed",
    accent: "#fb923c",
    accentSoft: "#ffedd5",
    paper: "#fffaf5",
  },
  highlightForms: { "ու": ["ու"], և: ["եւ"] },
  sources: (
    <>
      Commonness was guided by the <a className="underline hover:text-[var(--script-primary)]" href="https://wortschatz.uni-leipzig.de/en/download/Armenian">Leipzig Armenian news corpus</a> and a public <a className="underline hover:text-[var(--script-primary)]" href="https://github.com/dddiaz/1000-armenian-words">Armenian learner list</a>. Romanizations and meanings were adapted from the <a className="underline hover:text-[var(--script-primary)]" href="https://kaikki.org/dictionary/Armenian/">Kaikki Armenian dictionary</a>, extracted from Wiktionary under CC BY-SA.
    </>
  ),
};

export default function ArmenianAlphabet() {
  return <ScriptLearningPage data={courseData} config={config} />;
}
