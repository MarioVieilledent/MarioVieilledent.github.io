import ScriptLearningPage, { type ScriptCourseConfig } from "../components/script/ScriptLearningPage";
import { tamilCourseData } from "../data/southIndianScriptData";
const config: ScriptCourseConfig = {
  id: "tamil-script", language: "Tamil", nativeName: "தமிழ் · தமிழ் எழுத்துக்கள்", languageCode: "ta", direction: "ltr", title: "Learn the", titleAccent: "Tamil script", eyebrow: "Kolam path · எழுத்துப் பயணம்",
  description: "Explore Tamil’s rounded vowels and consonants, compare independent and dependent forms, and practise with familiar Tamil words.",
  libraryDescription: "Open every card to see its spoken value, written forms, and three examples in Tamil. Vowel signs combine with consonants to build syllables.",
  formNote: "Tamil has 12 vowels, 18 core consonants, and the special āytam ஃ. A pulli suppresses a consonant’s inherent vowel.",
  readingNote: "Type the simple Latin transcription shown in the key. Long vowels are written twice, such as aa and uu.",
  quizTip: "Follow each loop and tail carefully; vowel signs may appear before, after, above, or below a consonant.",
  footerNote: "Tamil is a left-to-right abugida. Its consonant–vowel combinations are built systematically from the core signs shown here.", motif: "kolam",
  compactGlyphs: true,
  theme: { dark: "#701a1a", deep: "#991b1b", primary: "#b91c1c", mid: "#f59e0b", pale: "#fde68a", tint: "#fffbeb", accent: "#fbbf24", accentSoft: "#fef3c7", paper: "#fffdf5" },
  highlightForms: { "ஆ":["ா"], "இ":["ி"], "ஈ":["ீ"], "உ":["ு"], "ஊ":["ூ"], "எ":["ெ"], "ஏ":["ே"], "ஐ":["ை"], "ஒ":["ொ"], "ஓ":["ோ"], "ஔ":["ௌ"] },
  sources: <>Letter order and terminology follow the <a className="underline hover:text-[var(--script-primary)]" href="https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-12/">Unicode South Asian scripts specification</a>; examples use common contemporary Tamil vocabulary.</>,
};
export default function Tamil() { return <ScriptLearningPage data={tamilCourseData} config={config} />; }
