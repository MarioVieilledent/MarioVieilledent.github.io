import ScriptLearningPage, { type ScriptCourseConfig } from "../components/script/ScriptLearningPage";
import { malayalamCourseData } from "../data/southIndianScriptData";
const config: ScriptCourseConfig = {
  id: "malayalam-script", language: "Malayalam", nativeName: "മലയാളം · മലയാളലിപി", languageCode: "ml", direction: "ltr", title: "Learn the", titleAccent: "Malayalam script", eyebrow: "Akshara path · അക്ഷരയാത്ര",
  description: "Follow Malayalam’s looping forms from vowels to consonants, open character guides, and build confidence with real Malayalam words.",
  libraryDescription: "Explore modern Malayalam base characters and signs. Every card includes pronunciation, written forms, and three contextual examples.",
  formNote: "A consonant carries an inherent a unless a vowel sign changes it. The chandrakkala ് suppresses the vowel and helps form clusters.",
  readingNote: "Type the simple Latin transcription in the key. Doubled vowels and consonants represent length and gemination.",
  quizTip: "Many letters share a circular skeleton; compare their opening, inner loop, and final stroke before choosing.",
  footerNote: "Malayalam is a left-to-right abugida. Modern print also uses special chillu forms for several vowel-less consonants.", motif: "kolam",
  compactGlyphs: true,
  theme: { dark: "#064e3b", deep: "#065f46", primary: "#047857", mid: "#34d399", pale: "#a7f3d0", tint: "#ecfdf5", accent: "#f59e0b", accentSoft: "#fef3c7", paper: "#fbfef9" },
  highlightForms: { "ആ":["ാ"], "ഇ":["ി"], "ഈ":["ീ"], "ഉ":["ു"], "ഊ":["ൂ"], "ഋ":["ൃ"], "എ":["െ"], "ഏ":["േ"], "ഐ":["ൈ"], "ഒ":["ൊ"], "ഓ":["ോ"], "ഔ":["ൗ"], "അം":["ം"], "അഃ":["ഃ"] },
  sources: <>Letter order and terminology follow the <a className="underline hover:text-[var(--script-primary)]" href="https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-12/">Unicode South Asian scripts specification</a>; examples use common Malayalam vocabulary.</>,
};
export default function Malayalam() { return <ScriptLearningPage data={malayalamCourseData} config={config} />; }
