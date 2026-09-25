import ScriptLearningPage, { type ScriptCourseConfig } from "../components/script/ScriptLearningPage";
import { katakanaCourseData } from "../data/japaneseScriptData";

const config: ScriptCourseConfig = {
  id: "japanese-katakana",
  language: "Japanese",
  nativeName: "日本語 · カタカナ",
  languageCode: "ja",
  direction: "ltr",
  title: "Learn Japanese",
  titleAccent: "Katakana",
  eyebrow: "Kana studio · カナ",
  description: "Master the 46 basic katakana plus all 25 dakuten and handakuten forms through sound-by-sound reading practice, character cards, and quick recognition rounds.",
  libraryDescription: "Katakana commonly writes loanwords, foreign names, sound effects, and emphasis. Open a card for three words that show the character in context.",
  formNote: "The 46 basic gojūon are followed by 20 dakuten and five handakuten kana. The long-vowel mark ー, small vowels, and combinations such as シャ extend the system.",
  readingNote: "Type Hepburn-style rōmaji. Double consonants come from small ッ, and ー lengthens the preceding vowel.",
  quizTip: "Watch stroke direction in look-alike pairs such as シ／ツ and ソ／ン, then compare ノ, メ, and ヌ.",
  footerNote: "Katakana is a phonetic Japanese syllabary, especially prominent in loanwords. This course includes 71 basic and voiced forms; optional audio uses an installed Japanese browser voice.",
  motif: "asanoha",
  unitLabel: "kana",
  libraryLayout: "gojuon",
  theme: { dark: "#172554", deep: "#1e3a8a", primary: "#1d4ed8", mid: "#60a5fa", pale: "#bfdbfe", tint: "#eff6ff", accent: "#f97316", accentSoft: "#ffedd5", paper: "#f8fafc" },
  sources: <>Kana order and usage follow the Japan Foundation’s <a className="underline hover:text-[var(--script-primary)]" href="https://www.irodori.jpf.go.jp/en/starter/pdf.html">Irodori Starter materials</a>; vocabulary is common contemporary Japanese.</>,
};

export default function Katakana() { return <ScriptLearningPage data={katakanaCourseData} config={config} />; }
