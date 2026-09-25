import ScriptLearningPage, { type ScriptCourseConfig } from "../components/script/ScriptLearningPage";
import { hiraganaCourseData } from "../data/japaneseScriptData";

const config: ScriptCourseConfig = {
  id: "japanese-hiragana",
  language: "Japanese",
  nativeName: "日本語 · ひらがな",
  languageCode: "ja",
  direction: "ltr",
  title: "Learn Japanese",
  titleAccent: "Hiragana",
  eyebrow: "Kana path · かなの道",
  description: "Learn the 46 basic hiragana, open every character for real Japanese examples, and build reading confidence one five-sound row at a time.",
  libraryDescription: "Hiragana records Japanese sounds and is used for native words, grammar, and readings. Each card includes three real words or phrases.",
  formNote: "This course begins with the 46 basic gojūon. Voiced marks, combined sounds such as きゃ, and the small っ build on these shapes.",
  readingNote: "Type Hepburn-style rōmaji without macrons. The particle を is typed o, matching its modern pronunciation.",
  quizTip: "Notice the direction of loops and the number of strokes. Similar pairs include さ／き, ぬ／め, and れ／ね.",
  footerNote: "Hiragana is a phonetic Japanese syllabary. This course covers the 46 basic modern signs; browser speech provides optional Japanese audio when a voice is installed.",
  motif: "seigaiha",
  unitLabel: "kana",
  theme: { dark: "#7f1d1d", deep: "#991b1b", primary: "#b91c1c", mid: "#ef4444", pale: "#fecaca", tint: "#fef2f2", accent: "#fbbf24", accentSoft: "#fef3c7", paper: "#fffaf7" },
  sources: <>Kana order and usage follow the Japan Foundation’s <a className="underline hover:text-[var(--script-primary)]" href="https://www.irodori.jpf.go.jp/en/starter/pdf.html">Irodori Starter materials</a>; vocabulary is common contemporary Japanese.</>,
};

export default function Hiragana() { return <ScriptLearningPage data={hiraganaCourseData} config={config} />; }
