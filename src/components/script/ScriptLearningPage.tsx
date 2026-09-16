import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  LuArrowRight,
  LuBookOpen,
  LuCheck,
  LuCircleHelp,
  LuInfo,
  LuLayers3,
  LuLibraryBig,
  LuLightbulb,
  LuSparkles,
  LuVolume2,
  LuX,
} from "react-icons/lu";
import Navbar from "../Navbar";
import "../../scriptLearning.css";
import type {
  ScriptCourseData,
  ScriptExample,
  ScriptLetter,
} from "../../scriptLearningTypes";

type View = "library" | "reading" | "quiz";

type QuizQuestion = {
  letter: ScriptLetter;
  example: ScriptExample;
  choices: ScriptLetter[];
};

type Theme = {
  dark: string;
  deep: string;
  primary: string;
  mid: string;
  pale: string;
  tint: string;
  accent: string;
  accentSoft: string;
  paper: string;
};

export type ScriptCourseConfig = {
  id: string;
  language: string;
  nativeName: string;
  languageCode: string;
  direction: "ltr" | "rtl";
  title: string;
  titleAccent: string;
  eyebrow: string;
  description: string;
  libraryDescription: string;
  formNote: string;
  readingNote: string;
  quizTip: string;
  footerNote: string;
  motif: "rangoli" | "vine" | "eternity" | "magen-david";
  theme: Theme;
  highlightForms?: Record<string, string[]>;
  sources: ReactNode;
};

type ScriptStyle = CSSProperties & Record<`--script-${string}`, string>;

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
};

const makeQuestion = (alphabet: ScriptLetter[]): QuizQuestion => {
  const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
  const example = letter.examples[Math.floor(Math.random() * letter.examples.length)];
  const distractors = shuffle(alphabet.filter((item) => item.letter !== letter.letter)).slice(0, 3);
  return { letter, example, choices: shuffle([letter, ...distractors]) };
};

const CulturalPattern = ({ motif }: { motif: ScriptCourseConfig["motif"] }) => {
  const pattern = {
    rangoli: (
      <pattern id="script-pattern" width="112" height="112" patternUnits="userSpaceOnUse">
        <circle cx="56" cy="56" r="31" fill="none" stroke="currentColor" />
        <path d="M56 16 67 45 96 56 67 67 56 96 45 67 16 56 45 45Z" fill="none" stroke="currentColor" />
        <circle cx="56" cy="56" r="8" fill="currentColor" />
      </pattern>
    ),
    vine: (
      <pattern id="script-pattern" width="120" height="80" patternUnits="userSpaceOnUse">
        <path d="M-10 60C20 10 42 10 60 40S100 70 130 20" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M28 25c15-13 25-7 20 8-13 4-20 1-20-8Zm43 28c14-13 25-7 20 8-13 4-20 1-20-8Z" fill="none" stroke="currentColor" />
        <circle cx="55" cy="42" r="5" fill="currentColor" />
      </pattern>
    ),
    eternity: (
      <pattern id="script-pattern" width="108" height="108" patternUnits="userSpaceOnUse">
        <path d="M54 8c7 17 18 24 38 25-15 12-20 25-14 45-18-8-31-5-47 8 2-20-5-32-21-43 20-4 31-14 44-35Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M54 28c5 10 12 15 24 16-9 8-11 16-8 28-10-5-19-3-28 5 1-12-3-19-13-26 12-2 18-8 25-23Z" fill="none" stroke="currentColor" />
      </pattern>
    ),
    "magen-david": (
      <pattern id="script-pattern" width="112" height="98" patternUnits="userSpaceOnUse">
        <path d="m56 8 39 68H17Zm0 82L17 22h78Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="56" cy="49" r="9" fill="none" stroke="currentColor" />
      </pattern>
    ),
  }[motif];

  return (
    <svg className="absolute inset-0 h-full w-full text-white opacity-[0.11]" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>{pattern}</defs>
      <rect width="100%" height="100%" fill="url(#script-pattern)" />
    </svg>
  );
};

const CulturalMark = ({ motif, className = "" }: { motif: ScriptCourseConfig["motif"]; className?: string }) => {
  const path = {
    rangoli: <><circle cx="50" cy="50" r="29" /><path d="M50 3 62 36 97 50 62 64 50 97 38 64 3 50 38 36Z" /></>,
    vine: <><path d="M9 79C24 18 72 11 91 46 104 71 71 92 47 74 25 57 39 30 66 34" /><circle cx="34" cy="46" r="7" /><circle cx="64" cy="66" r="7" /></>,
    eternity: <path d="M50 4c8 21 22 31 45 32-18 15-23 31-16 55-22-10-39-7-58 9 3-24-5-39-24-52 24-5 38-17 53-44Z" />,
    "magen-david": <><path d="m50 5 42 72H8Zm0 90L8 23h84Z" /><circle cx="50" cy="50" r="9" /></>,
  }[motif];
  return <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>{path}</svg>;
};

const highlightedParts = (word: string, letter: string, forms?: Record<string, string[]>) => {
  const targets = [letter, ...(forms?.[letter] ?? [])].sort((a, b) => b.length - a.length);
  const match = targets.map((target) => ({ target, index: word.indexOf(target) })).find(({ index }) => index >= 0);
  if (!match) return { before: word, target: "", after: "" };
  return {
    before: word.slice(0, match.index),
    target: word.slice(match.index, match.index + match.target.length),
    after: word.slice(match.index + match.target.length),
  };
};

const HighlightedWord = ({ word, letter, config }: { word: string; letter: string; config: ScriptCourseConfig }) => {
  const parts = highlightedParts(word, letter, config.highlightForms);
  return <span lang={config.languageCode} dir={config.direction} aria-label={word}>{parts.before}<span className="text-[var(--script-accent)]">{parts.target}</span>{parts.after}</span>;
};

const AudioButton = ({ text, voice, config }: { text: string; voice?: SpeechSynthesisVoice; config: ScriptCourseConfig }) => {
  const speak = () => {
    if (!voice) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = config.languageCode;
    utterance.voice = voice;
    utterance.rate = 0.72;
    window.speechSynthesis.speak(utterance);
  };
  return (
    <button type="button" onClick={speak} disabled={!voice} aria-label={voice ? `Play pronunciation of ${text}` : "No compatible voice is installed"} title={voice ? "Play pronunciation" : "No compatible voice is installed on this device"} className="script-audio-button">
      <LuVolume2 size="17" aria-hidden="true" />
    </button>
  );
};

const LetterCard = ({ letter, index, config, onSelect }: { letter: ScriptLetter; index: number; config: ScriptCourseConfig; onSelect: (letter: ScriptLetter) => void }) => (
  <button type="button" onClick={() => onSelect(letter)} className="script-letter-card">
    <span className="absolute right-4 top-3 text-xs font-bold tabular-nums text-stone-300">{String(index + 1).padStart(2, "0")}</span>
    <span lang={config.languageCode} dir={config.direction} className="block text-center text-7xl font-semibold leading-none text-[var(--script-deep)] transition-transform duration-200 group-hover:scale-105">{letter.letter}</span>
    <span className="mt-5 block text-base font-bold text-stone-900 capitalize">{letter.name}</span>
    <span className="mt-1 flex items-center justify-between gap-2 text-xs text-stone-500"><span>{letter.transliteration}</span><span className="flex items-center gap-1 font-bold text-[var(--script-primary)]">Explore <LuArrowRight size="14" aria-hidden="true" /></span></span>
    <span className="absolute inset-x-5 bottom-0 h-1 origin-left scale-x-0 rounded-t-full bg-[var(--script-accent)] transition-transform group-hover:scale-x-100" />
  </button>
);

const LetterDialog = ({ letter, voice, config, onClose }: { letter: ScriptLetter; voice?: SpeechSynthesisVoice; config: ScriptCourseConfig; onClose: () => void }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleKeyDown); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="script-letter-dialog-title" className="max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] bg-[var(--script-paper)] shadow-2xl sm:rounded-[2rem]">
        <div className="relative overflow-hidden bg-[var(--script-deep)] px-6 py-7 text-white sm:px-9">
          <CulturalPattern motif={config.motif} />
          <div className="relative flex items-start justify-between gap-5">
            <div className="flex items-center gap-5">
              <div lang={config.languageCode} dir={config.direction} className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.7rem] border border-white/20 bg-white/10 text-7xl font-semibold leading-none shadow-inner">{letter.letter}</div>
              <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-white/65">Letter guide</p><h2 id="script-letter-dialog-title" className="text-3xl font-bold capitalize sm:text-4xl">{letter.name}</h2><p className="mt-1 text-white/75">Transliteration: <span className="font-bold text-white">{letter.transliteration}</span></p></div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close letter guide" className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"><LuX size="22" aria-hidden="true" /></button>
          </div>
        </div>
        <div className="space-y-8 p-6 sm:p-9">
          <section><div className="script-section-label"><LuVolume2 aria-hidden="true" /> Pronunciation</div><p className="text-lg leading-8 text-stone-700">{letter.sound}</p></section>
          <section>
            <div className="script-section-label"><LuSparkles aria-hidden="true" /> Written forms</div>
            <div className={`grid gap-3 ${letter.forms.length === 1 ? "grid-cols-1 max-w-xs" : "grid-cols-2"}`}>{letter.forms.map((form) => <div key={form.label} className="script-form-card"><div lang={config.languageCode} dir={config.direction} className="text-5xl font-semibold text-[var(--script-deep)]">{form.glyph}</div><div className="mt-2 text-xs font-bold text-stone-500">{form.label}</div></div>)}</div>
            <div className="mt-3 flex gap-2 rounded-xl bg-[var(--script-accent-soft)] px-4 py-3 text-sm leading-6 text-stone-700"><LuInfo className="mt-1 shrink-0 text-[var(--script-primary)]" aria-hidden="true" />{config.formNote}</div>
          </section>
          <section>
            <div className="script-section-label"><LuBookOpen aria-hidden="true" /> Three common examples</div>
            <div className="grid gap-3 sm:grid-cols-3">{letter.examples.map((example, index) => <div key={`${example.script}-${index}`} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><div className="mb-3 flex items-center justify-between"><span className="script-example-label">Example {index + 1}</span><AudioButton text={example.script} voice={voice} config={config} /></div><div className="text-4xl font-semibold text-stone-900"><HighlightedWord word={example.script} letter={letter.letter} config={config} /></div><div className="mt-2 text-sm text-stone-500">{example.translation}</div></div>)}</div>
          </section>
        </div>
      </div>
    </div>
  );
};

const LetterLibrary = ({ data, config, onSelect }: { data: ScriptCourseData; config: ScriptCourseConfig; onSelect: (letter: ScriptLetter) => void }) => (
  <section aria-labelledby="script-letter-library-heading">
    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="script-kicker">The complete set</p><h2 id="script-letter-library-heading" className="text-3xl font-bold tracking-tight text-stone-900">{config.language} letters</h2></div><p className="max-w-lg text-sm leading-6 text-stone-500">{config.libraryDescription}</p></div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">{data.alphabet.map((letter, index) => <LetterCard key={letter.letter} letter={letter} index={index} config={config} onSelect={onSelect} />)}</div>
  </section>
);

const ReadingLessons = ({ data, config, lessonIndex, answers, onLessonChange, onAnswerChange, onSelectLetter }: { data: ScriptCourseData; config: ScriptCourseConfig; lessonIndex: number; answers: Record<string, string>; onLessonChange: (index: number) => void; onAnswerChange: (word: string, value: string) => void; onSelectLetter: (letter: ScriptLetter) => void }) => {
  const lesson = data.lessons[lessonIndex];
  const knownLetters = data.lessons.slice(0, lessonIndex + 1).flatMap((item) => item.letters);
  const newLetters = lesson.letters.map((symbol) => data.alphabet.find((item) => item.letter === symbol)).filter((item): item is ScriptLetter => Boolean(item));
  const isCorrect = (word: { script: string; latin: string }) => (answers[word.script] ?? "").trim().toLowerCase() === word.latin.toLowerCase();
  const correctCount = lesson.words.filter(isCorrect).length;
  return (
    <section aria-labelledby="script-reading-heading">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="script-kicker">Learn little by little</p><h2 id="script-reading-heading" className="text-3xl font-bold tracking-tight text-stone-900">Read with the letters you know</h2></div><p className="max-w-lg text-sm leading-6 text-stone-500">Each lesson adds two to four letters. All 50 words use only letters introduced so far and contain at least one of the new letters.</p></div>
      <div className="-mx-5 mb-8 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0" aria-label="Reading lessons"><div className="flex w-max gap-2">{data.lessons.map((item, index) => { const active = index === lessonIndex; const completed = item.words.filter(isCorrect).length; return <button type="button" key={index} onClick={() => onLessonChange(index)} aria-current={active ? "step" : undefined} className={`script-lesson-tab ${active ? "script-lesson-tab-active" : ""}`}><span className="block text-xs font-bold uppercase tracking-[0.12em]">Lesson {index + 1}</span><span lang={config.languageCode} dir={config.direction} className="mt-1 block text-2xl font-semibold">{item.letters.join(" ")}</span><span className="mt-1 block text-xs opacity-75">{completed}/50 read</span></button>; })}</div></div>
      <div className="script-new-letters-panel">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="script-kicker">Lesson {lessonIndex + 1} · {knownLetters.length} letters available</p><h3 className="mt-1 text-2xl font-bold text-stone-900">New letters</h3></div><p className="text-sm font-bold text-[var(--script-primary)]">{correctCount}/50 words read</p></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{newLetters.map((letter, index) => <LetterCard key={letter.letter} letter={letter} index={index} config={config} onSelect={onSelectLetter} />)}</div>
        <details className="mt-5 rounded-2xl border border-[var(--script-pale)] bg-white p-4 text-sm leading-6 text-stone-600"><summary className="cursor-pointer font-bold text-stone-800">Latin transcription key</summary><p className="mt-2">{knownLetters.map((letter) => `${letter} = ${data.alphabet.find((item) => item.letter === letter)?.transliteration}`).join(" · ")}</p><p className="mt-2">{config.readingNote}</p></details>
      </div>
      <div className="space-y-8">{Array.from({ length: 5 }, (_, section) => { const words = lesson.words.slice(section * 10, section * 10 + 10); const sectionCorrect = words.filter(isCorrect).length; return <section key={section} aria-labelledby={`script-reading-set-${section}`}><div className="mb-3 flex items-end justify-between gap-3"><div><p className="script-kicker">Set {section + 1} of 5 · longer words</p><h3 id={`script-reading-set-${section}`} className="text-xl font-bold text-stone-900">Words {section * 10 + 1}–{section * 10 + 10}</h3></div><span className="text-sm font-semibold text-[var(--script-primary)]">{sectionCorrect}/10</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{words.map((word, wordIndex) => { const answer = answers[word.script] ?? ""; const correct = isCorrect(word); return <div key={`${word.script}-${wordIndex}`} className={`script-word-card ${correct ? "script-word-card-correct" : ""}`}><div className="mb-3 flex items-center justify-between gap-2"><span className="text-xs font-bold tabular-nums text-stone-400">{String(section * 10 + wordIndex + 1).padStart(2, "0")}</span>{correct && <LuCheck className="text-[var(--script-primary)]" aria-label="Correct" />}</div><div lang={config.languageCode} dir={config.direction} className="min-h-14 text-center text-4xl font-semibold text-[var(--script-deep)]">{word.script}</div><p className="mt-2 min-h-10 text-center text-xs leading-5 text-stone-600" aria-label="English translation">{word.translation}</p><input type="text" value={answer} onChange={(event) => onAnswerChange(word.script, event.target.value)} disabled={correct} aria-label={`Latin transcription for ${word.script}`} placeholder="Latin transcription" autoCapitalize="none" autoComplete="off" spellCheck={false} dir="ltr" className="script-reading-input" /></div>; })}</div></section>; })}</div>
      <p className="mt-9 text-xs leading-5 text-stone-500">{config.sources}</p>
    </section>
  );
};

const Quiz = ({ data, config, question, onNext }: { data: ScriptCourseData; config: ScriptCourseConfig; question: QuizQuestion; onNext: () => void }) => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const choose = (choice: ScriptLetter) => { if (answer) return; const right = choice.letter === question.letter.letter; setAnswer(choice.letter); setAttempts((value) => value + 1); if (right) { setCorrect((value) => value + 1); setStreak((value) => value + 1); } else setStreak(0); };
  const next = () => { setAnswer(null); onNext(); };
  const answerIsCorrect = answer === question.letter.letter;
  return (
    <section aria-labelledby="script-quiz-heading" className="mx-auto max-w-4xl">
      <div className="mb-6 text-center"><p className="script-kicker">Recognition practice</p><h2 id="script-quiz-heading" className="text-3xl font-bold tracking-tight text-stone-900">Which letter is highlighted?</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-500">Look at the colored letter in a common word, then choose its standalone form.</p></div>
      <div className="grid gap-5 md:grid-cols-[1fr_15rem]">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--script-pale)] bg-white shadow-[0_18px_55px_var(--script-shadow)]"><div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-[var(--script-deep)] p-8 text-white"><CulturalPattern motif={config.motif} /><CulturalMark motif={config.motif} className="absolute -left-12 -top-12 h-44 w-44 text-white opacity-15" /><div className="relative text-center"><div className="text-7xl font-semibold sm:text-8xl"><HighlightedWord word={question.example.script} letter={question.letter.letter} config={config} /></div><p className="mt-5 text-sm text-white/75">{question.example.translation}</p></div></div>
          <div className="p-5 sm:p-7"><div className="grid grid-cols-4 gap-3">{question.choices.map((choice) => { const chosen = answer === choice.letter; const right = choice.letter === question.letter.letter; return <button type="button" key={choice.letter} onClick={() => choose(choice)} disabled={Boolean(answer)} aria-label={choice.name} className={`script-quiz-choice ${answer ? right ? "script-quiz-choice-right" : chosen ? "script-quiz-choice-wrong" : "script-quiz-choice-muted" : ""}`} lang={config.languageCode}>{choice.letter}{answer && right && <LuCheck className="absolute right-2 top-2" size="17" aria-hidden="true" />}{answer && chosen && !right && <LuX className="absolute right-2 top-2" size="17" aria-hidden="true" />}</button>; })}</div>{answer && <div className={`mt-5 flex flex-col justify-between gap-4 rounded-2xl p-4 sm:flex-row sm:items-center ${answerIsCorrect ? "bg-[var(--script-tint)]" : "bg-amber-50"}`} aria-live="polite"><div><p className="font-bold text-stone-900">{answerIsCorrect ? "Beautiful — that’s right!" : `That is ${question.letter.name}.`}</p><p className="mt-1 text-sm text-stone-600">The highlighted letter is <span lang={config.languageCode} className="font-bold">{question.letter.letter}</span> · {question.letter.transliteration}</p></div><button type="button" onClick={next} className="script-primary-button">Next word <LuArrowRight aria-hidden="true" /></button></div>}</div>
        </div>
        <aside className="space-y-3"><div className="script-aside-card"><p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">Your session</p><div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-1"><div><div className="script-score">{correct}/{attempts}</div><div className="text-xs text-stone-500">Correct</div></div><div><div className="script-score">{attempts ? Math.round((correct / attempts) * 100) : 0}%</div><div className="text-xs text-stone-500">Accuracy</div></div><div><div className="text-2xl font-bold text-[var(--script-accent)]">{streak}</div><div className="text-xs text-stone-500">Streak</div></div></div></div><div className="rounded-2xl bg-[var(--script-accent-soft)] p-5 text-sm leading-6 text-stone-700"><LuLightbulb className="mb-2 text-[var(--script-primary)]" /><strong>Look closely.</strong> {config.quizTip}</div><div className="script-aside-card text-sm text-stone-500">Practising all <strong className="text-stone-800">{data.alphabet.length}</strong> {config.language} letters.</div></aside>
      </div>
    </section>
  );
};

const loadProgress = (config: ScriptCourseConfig, lessonCount: number) => {
  if (typeof window === "undefined") return { lessonIndex: 0, answers: {} as Record<string, string> };
  try { const value = JSON.parse(window.localStorage.getItem(`script-course-${config.id}-v1`) ?? "null") as { lessonIndex?: number; answers?: Record<string, string> } | null; return { lessonIndex: Math.min(Math.max(value?.lessonIndex ?? 0, 0), lessonCount - 1), answers: value?.answers ?? {} }; } catch { return { lessonIndex: 0, answers: {} as Record<string, string> }; }
};

export default function ScriptLearningPage({ data, config }: { data: ScriptCourseData; config: ScriptCourseConfig }) {
  const [view, setView] = useState<View>("library");
  const [progress, setProgress] = useState(() => loadProgress(config, data.lessons.length));
  const [selectedLetter, setSelectedLetter] = useState<ScriptLetter | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [question, setQuestion] = useState(() => makeQuestion(data.alphabet));
  useEffect(() => { try { window.localStorage.setItem(`script-course-${config.id}-v1`, JSON.stringify(progress)); } catch { /* Practice still works without storage. */ } }, [config.id, progress]);
  useEffect(() => { if (!("speechSynthesis" in window)) return; const load = () => setVoices(window.speechSynthesis.getVoices()); load(); window.speechSynthesis.addEventListener("voiceschanged", load); return () => window.speechSynthesis.removeEventListener("voiceschanged", load); }, []);
  const voice = useMemo(() => voices.find((item) => item.lang.toLowerCase().startsWith(config.languageCode.toLowerCase())), [config.languageCode, voices]);
  const style: ScriptStyle = { "--script-dark": config.theme.dark, "--script-deep": config.theme.deep, "--script-primary": config.theme.primary, "--script-mid": config.theme.mid, "--script-pale": config.theme.pale, "--script-tint": config.theme.tint, "--script-accent": config.theme.accent, "--script-accent-soft": config.theme.accentSoft, "--script-paper": config.theme.paper, "--script-shadow": `${config.theme.dark}1a` };
  return (
    <div lang="en" dir="ltr" style={style} className="script-course min-h-screen bg-[var(--script-paper)] text-stone-900">
      <Navbar />
      <main>
        <section className="relative isolate overflow-hidden bg-[var(--script-dark)] text-white"><CulturalPattern motif={config.motif} /><CulturalMark motif={config.motif} className="absolute -right-20 -top-24 h-80 w-80 text-[var(--script-accent)] opacity-25" /><CulturalMark motif={config.motif} className="absolute -bottom-24 left-[42%] h-64 w-64 text-white opacity-10" /><div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end"><div className="max-w-3xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80"><LuSparkles className="text-[var(--script-accent)]" aria-hidden="true" /> {config.eyebrow}</div><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{config.title} <span className="text-[var(--script-accent)]">{config.titleAccent}</span></h1><p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">{config.description}</p><p lang={config.languageCode} dir={config.direction} className="mt-4 text-2xl text-white/55">{config.nativeName}</p></div><div className="grid w-fit grid-cols-2 overflow-hidden rounded-[1.7rem] border border-white/15 bg-white/10 backdrop-blur-sm"><div className="px-6 py-4 text-center"><div className="text-3xl font-bold text-[var(--script-accent)]">{data.alphabet.length}</div><div className="text-xs text-white/70">Letters</div></div><div className="border-l border-white/15 px-6 py-4 text-center"><div className="text-3xl font-bold text-[var(--script-accent)]">{data.lessons.length}</div><div className="text-xs text-white/70">Lessons</div></div></div></div><div className="absolute bottom-0 left-1/2 h-8 w-48 -translate-x-1/2 rounded-t-[6rem] bg-[var(--script-paper)] sm:w-72" /></section>
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8">
          <div className="mb-10 overflow-x-auto rounded-[1.6rem] border border-[var(--script-pale)] bg-white p-3 shadow-[0_8px_30px_var(--script-shadow)]"><div className="flex min-w-max rounded-2xl bg-stone-100 p-1 sm:min-w-0">{(["library", "reading", "quiz"] as const).map((item) => { const labels = { library: [<LuLibraryBig key="i" />, "Letter library"], reading: [<LuLayers3 key="i" />, "Reading lessons"], quiz: [<LuCircleHelp key="i" />, "Recognition quiz"] }; return <button type="button" key={item} onClick={() => setView(item)} className={`script-view-button ${view === item ? "script-view-button-active" : ""}`}>{labels[item]}</button>; })}</div></div>
          {view === "library" ? <LetterLibrary data={data} config={config} onSelect={setSelectedLetter} /> : view === "reading" ? <ReadingLessons data={data} config={config} lessonIndex={progress.lessonIndex} onLessonChange={(lessonIndex) => setProgress((previous) => ({ ...previous, lessonIndex }))} answers={progress.answers} onAnswerChange={(word, value) => setProgress((previous) => ({ ...previous, answers: { ...previous.answers, [word]: value } }))} onSelectLetter={setSelectedLetter} /> : <Quiz key={config.id} data={data} config={config} question={question} onNext={() => setQuestion(makeQuestion(data.alphabet))} />}
          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--script-pale)] bg-[var(--script-tint)] p-5 text-sm leading-6 text-stone-600 sm:flex-row sm:items-center"><div className="flex max-w-3xl gap-3"><LuInfo className="mt-1 shrink-0 text-[var(--script-primary)]" aria-hidden="true" /><p>{config.footerNote}</p></div><div className="flex shrink-0 items-center gap-2 text-xs font-bold text-[var(--script-primary)]"><CulturalMark motif={config.motif} className="h-8 w-8" /> Read {config.direction === "rtl" ? "right to left" : "left to right"}</div></div>
        </div>
      </main>
      {selectedLetter && <LetterDialog letter={selectedLetter} voice={voice} config={config} onClose={() => setSelectedLetter(null)} />}
    </div>
  );
}

