import ScriptLearningPage, { type ScriptCourseConfig } from "../components/script/ScriptLearningPage";
import { kannadaCourseData } from "../data/southIndianScriptData";
const config: ScriptCourseConfig = {
  id: "kannada-script", language: "Kannada", nativeName: "ಕನ್ನಡ · ಕನ್ನಡ ಲಿಪಿ", languageCode: "kn", direction: "ltr", title: "Learn the", titleAccent: "Kannada script", eyebrow: "Akshara path · ಅಕ್ಷರ ಪಯಣ",
  description: "Learn Kannada’s elegant rounded characters, connect vowels with consonants, and practise recognition with everyday Kannada words.",
  libraryDescription: "Browse the modern vowels, signs, and consonants. Each card explains its form and places it in three Kannada examples.",
  formNote: "Kannada consonants include an inherent a. Vowel signs replace that vowel; the virama ್ creates a bare consonant for clusters.",
  readingNote: "Enter the simple Latin transcription shown in the key. Use doubled vowels for long sounds.",
  quizTip: "Look for the direction of the outer curve and for small interior strokes that distinguish related characters.",
  footerNote: "Kannada is written left to right. Its consonant clusters can form compact joined shapes, while this first course focuses on their base letters.", motif: "kolam",
  theme: { dark: "#7c2d12", deep: "#9a3412", primary: "#c2410c", mid: "#f97316", pale: "#fed7aa", tint: "#fff7ed", accent: "#facc15", accentSoft: "#fef9c3", paper: "#fffdf7" },
  highlightForms: { "ಆ":["ಾ"], "ಇ":["ಿ"], "ಈ":["ೀ"], "ಉ":["ು"], "ಊ":["ೂ"], "ಋ":["ೃ"], "ಎ":["ೆ"], "ಏ":["ೇ"], "ಐ":["ೈ"], "ಒ":["ೊ"], "ಓ":["ೋ"], "ಔ":["ೌ"], "ಅಂ":["ಂ"], "ಅಃ":["ಃ"] },
  sources: <>Letter order and terminology follow the <a className="underline hover:text-[var(--script-primary)]" href="https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-12/">Unicode South Asian scripts specification</a>; examples use common Kannada vocabulary.</>,
};
export default function Kannada() { return <ScriptLearningPage data={kannadaCourseData} config={config} />; }
