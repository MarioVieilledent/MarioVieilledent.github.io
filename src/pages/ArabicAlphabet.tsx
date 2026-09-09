import { useEffect, useMemo, useState } from "react";
import {
  LuArrowRight,
  LuBookOpen,
  LuCheck,
  LuCircleHelp,
  LuInfo,
  LuLanguages,
  LuLibraryBig,
  LuSparkles,
  LuVolume2,
  LuX,
} from "react-icons/lu";
import Navbar from "../components/Navbar";
import {
  alphabetByLanguage,
  type AlphabetLetter,
  type LetterExample,
  type ScriptLanguage,
} from "../arabicAlphabetData";

type View = "library" | "quiz";

type QuizQuestion = {
  letter: AlphabetLetter;
  example: LetterExample;
  choices: AlphabetLetter[];
};

const languageDetails: Record<
  ScriptLanguage,
  { label: string; nativeLabel: string; code: string; noun: string }
> = {
  arabic: {
    label: "Arabic",
    nativeLabel: "العربية",
    code: "ar",
    noun: "Arabic",
  },
  persian: {
    label: "Persian",
    nativeLabel: "فارسی",
    code: "fa",
    noun: "Persian",
  },
};

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
};

const makeQuestion = (alphabet: AlphabetLetter[]): QuizQuestion => {
  const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
  const example = letter.examples[Math.floor(Math.random() * letter.examples.length)];
  const distractors = shuffle(alphabet.filter((item) => item.letter !== letter.letter)).slice(0, 3);

  return { letter, example, choices: shuffle([letter, ...distractors]) };
};

const GeometricStar = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    aria-hidden="true"
    className={className}
    fill="none"
  >
    <path
      d="M50 3 61 28 88 12 72 39 97 50 72 61 88 88 61 72 50 97 39 72 12 88 28 61 3 50 28 39 12 12 39 28Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="2" />
    <path d="m50 32 13 5 5 13-5 13-13 5-13-5-5-13 5-13Z" fill="currentColor" opacity=".22" />
  </svg>
);

const Pattern = () => (
  <svg
    className="absolute inset-0 h-full w-full opacity-[0.13]"
    viewBox="0 0 900 380"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <pattern id="islamic-grid" width="96" height="96" patternUnits="userSpaceOnUse">
        <path d="M48 2 59 37 94 48 59 59 48 94 37 59 2 48 37 37Z" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="48" cy="48" r="18" fill="none" stroke="white" />
        <path d="M0 0 20 20M96 0 76 20M0 96l20-20M96 96 76 76" stroke="white" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic-grid)" />
  </svg>
);

const HighlightedWord = ({
  example,
  targetClassName = "text-amber-500",
}: {
  example: LetterExample;
  targetClassName?: string;
}) => (
  <span dir="rtl" className="font-arabic" aria-label={example.word}>
    {Array.from(example.word).map((character, index) => (
      <span key={`${character}-${index}`} className={index === example.letterIndex ? targetClassName : ""}>
        {character}
      </span>
    ))}
  </span>
);

const AudioButton = ({
  text,
  language,
  voice,
}: {
  text: string;
  language: ScriptLanguage;
  voice?: SpeechSynthesisVoice;
}) => {
  const speak = () => {
    if (!voice) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageDetails[language].code;
    utterance.voice = voice;
    utterance.rate = 0.72;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={speak}
      disabled={!voice}
      aria-label={voice ? `Play pronunciation of ${text}` : "No compatible voice is installed"}
      title={voice ? "Play pronunciation" : "No compatible voice is installed on this device"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-300"
    >
      <LuVolume2 size="17" aria-hidden="true" />
    </button>
  );
};

const LanguageSwitch = ({
  language,
  onChange,
}: {
  language: ScriptLanguage;
  onChange: (language: ScriptLanguage) => void;
}) => (
  <div className="inline-flex rounded-full border border-emerald-200 bg-white p-1 shadow-sm" aria-label="Target language">
    {(Object.keys(languageDetails) as ScriptLanguage[]).map((item) => {
      const active = language === item;
      const details = languageDetails[item];
      return (
        <button
          type="button"
          key={item}
          onClick={() => onChange(item)}
          aria-pressed={active}
          className={`flex min-w-32 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition sm:min-w-40 ${
            active
              ? "bg-emerald-800 text-white shadow-sm"
              : "text-stone-600 hover:bg-emerald-50 hover:text-emerald-900"
          }`}
        >
          <span>{details.label}</span>
          <span lang={details.code} dir="rtl" className={active ? "text-emerald-100" : "text-stone-400"}>
            {details.nativeLabel}
          </span>
        </button>
      );
    })}
  </div>
);

const LetterDialog = ({
  letter,
  language,
  voice,
  onClose,
}: {
  letter: AlphabetLetter;
  language: ScriptLanguage;
  voice?: SpeechSynthesisVoice;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const forms = Object.entries(letter.forms) as [keyof AlphabetLetter["forms"], string][];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-emerald-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="letter-dialog-title"
        className="max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] bg-[#fbfaf6] shadow-2xl sm:rounded-[2rem]"
      >
        <div className="relative overflow-hidden bg-emerald-900 px-6 py-7 text-white sm:px-9">
          <Pattern />
          <div className="relative flex items-start justify-between gap-6">
            <div className="flex items-center gap-5">
              <div lang={languageDetails[language].code} dir="rtl" className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.7rem] border border-white/20 bg-white/10 text-7xl font-semibold shadow-inner">
                {letter.letter}
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Letter guide</p>
                <h2 id="letter-dialog-title" className="text-3xl font-bold sm:text-4xl">{letter.name}</h2>
                <p className="mt-1 text-emerald-100">Transliteration: <span className="font-bold text-white">{letter.transliteration}</span></p>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close letter guide" className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
              <LuX size="22" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-9">
          <section>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-emerald-800">
              <LuVolume2 aria-hidden="true" /> Pronunciation
            </div>
            <p className="text-lg leading-8 text-stone-700">{letter.sound}</p>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-emerald-800">
              <LuSparkles aria-hidden="true" /> Contextual forms
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {forms.map(([name, form]) => (
                <div key={name} className="rounded-2xl border border-emerald-100 bg-white p-4 text-center shadow-sm">
                  <div lang={languageDetails[language].code} dir="rtl" className="text-5xl font-semibold text-emerald-950">{form}</div>
                  <div className="mt-2 text-xs font-bold capitalize text-stone-500">{name}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
              <LuInfo className="mt-1 shrink-0" aria-hidden="true" />
              {letter.connectsForward
                ? "This letter connects to the letters on both sides when the neighboring letters allow it."
                : "This is a break letter: it connects to the letter before it, but never to the letter after it."}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-emerald-800">
              <LuBookOpen aria-hidden="true" /> See it in a word
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {letter.examples.map((example) => (
                <div key={example.position} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">{example.position}</span>
                    <AudioButton text={example.word} language={language} voice={voice} />
                  </div>
                  <div lang={languageDetails[language].code} className="text-4xl font-semibold text-stone-900">
                    <HighlightedWord example={example} />
                  </div>
                  <div className="mt-2 text-sm text-stone-500">{example.meaning}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const LetterLibrary = ({
  alphabet,
  language,
  onSelect,
}: {
  alphabet: AlphabetLetter[];
  language: ScriptLanguage;
  onSelect: (letter: AlphabetLetter) => void;
}) => (
  <section aria-labelledby="letter-library-heading">
    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">The complete set</p>
        <h2 id="letter-library-heading" className="text-3xl font-bold tracking-tight text-stone-900">{languageDetails[language].label} letters</h2>
      </div>
      <p className="max-w-md text-sm leading-6 text-stone-500">Read from right to left. Select any card to explore how the letter changes shape inside words.</p>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
      {alphabet.map((letter, index) => (
        <button
          type="button"
          key={letter.letter}
          onClick={() => onSelect(letter)}
          className="group relative min-h-48 overflow-hidden rounded-[1.4rem] border border-emerald-100 bg-white p-5 text-left shadow-[0_8px_30px_rgba(6,78,59,0.05)] transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_16px_35px_rgba(6,78,59,0.12)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          <span className="absolute right-4 top-3 text-xs font-bold tabular-nums text-stone-300">{String(index + 1).padStart(2, "0")}</span>
          <span lang={languageDetails[language].code} dir="rtl" className="block text-center text-7xl font-semibold leading-none text-emerald-950 transition-transform duration-200 group-hover:scale-105">{letter.letter}</span>
          <span className="mt-5 block text-base font-bold text-stone-900">{letter.name}</span>
          <span className="mt-1 flex items-center justify-between text-xs text-stone-500">
            <span>{letter.transliteration}</span>
            <span className="flex items-center gap-1 font-bold text-emerald-700">Explore <LuArrowRight size="14" aria-hidden="true" /></span>
          </span>
          <span className="absolute inset-x-5 bottom-0 h-1 origin-left scale-x-0 rounded-t-full bg-amber-400 transition-transform group-hover:scale-x-100" />
        </button>
      ))}
    </div>
  </section>
);

const Quiz = ({
  alphabet,
  language,
  question,
  onNext,
}: {
  alphabet: AlphabetLetter[];
  language: ScriptLanguage;
  question: QuizQuestion;
  onNext: () => void;
}) => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);

  const choose = (choice: AlphabetLetter) => {
    if (answer) return;
    const isCorrect = choice.letter === question.letter.letter;
    setAnswer(choice.letter);
    setAttempts((value) => value + 1);
    if (isCorrect) {
      setCorrect((value) => value + 1);
      setStreak((value) => value + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setAnswer(null);
    onNext();
  };

  const answerIsCorrect = answer === question.letter.letter;

  return (
    <section aria-labelledby="quiz-heading" className="mx-auto max-w-4xl">
      <div className="mb-6 text-center">
        <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Recognition practice</p>
        <h2 id="quiz-heading" className="text-3xl font-bold tracking-tight text-stone-900">Which letter is highlighted?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-500">Look at the colored letter in context, then choose its isolated form.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_15rem]">
        <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_18px_55px_rgba(6,78,59,0.1)]">
          <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-emerald-900 p-8 text-white">
            <Pattern />
            <GeometricStar className="absolute -left-12 -top-12 h-44 w-44 text-emerald-300 opacity-20" />
            <div className="relative text-center">
              <div lang={languageDetails[language].code} className="text-7xl font-semibold sm:text-8xl">
                <HighlightedWord example={question.example} targetClassName="text-amber-300" />
              </div>
              <p className="mt-5 text-sm text-emerald-100">{question.example.meaning}</p>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="grid grid-cols-4 gap-3">
              {question.choices.map((choice) => {
                const isChosen = answer === choice.letter;
                const isRightChoice = choice.letter === question.letter.letter;
                const resultClass = answer
                  ? isRightChoice
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                    : isChosen
                      ? "border-red-400 bg-red-50 text-red-800"
                      : "border-stone-200 bg-stone-50 text-stone-400"
                  : "border-stone-200 bg-white text-stone-900 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50";
                return (
                  <button
                    type="button"
                    key={choice.letter}
                    onClick={() => choose(choice)}
                    disabled={Boolean(answer)}
                    aria-label={choice.name}
                    className={`relative flex h-24 items-center justify-center rounded-2xl border-2 text-5xl font-semibold transition ${resultClass}`}
                    lang={languageDetails[language].code}
                  >
                    {choice.letter}
                    {answer && isRightChoice && <LuCheck className="absolute right-2 top-2 text-emerald-600" size="17" aria-hidden="true" />}
                    {answer && isChosen && !isRightChoice && <LuX className="absolute right-2 top-2 text-red-500" size="17" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>

            {answer && (
              <div className={`mt-5 flex flex-col justify-between gap-4 rounded-2xl p-4 sm:flex-row sm:items-center ${answerIsCorrect ? "bg-emerald-50" : "bg-amber-50"}`} aria-live="polite">
                <div>
                  <p className={`font-bold ${answerIsCorrect ? "text-emerald-900" : "text-amber-950"}`}>{answerIsCorrect ? "Beautiful — that’s right!" : `That is ${question.letter.name}.`}</p>
                  <p className="mt-1 text-sm text-stone-600">The highlighted letter is <span lang={languageDetails[language].code} className="font-bold">{question.letter.letter}</span> · {question.letter.transliteration}</p>
                </div>
                <button type="button" onClick={next} className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900">
                  Next word <LuArrowRight aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">Your session</p>
            <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-1">
              <div><div className="text-2xl font-bold text-emerald-900">{correct}/{attempts}</div><div className="text-xs text-stone-500">Correct</div></div>
              <div><div className="text-2xl font-bold text-emerald-900">{attempts ? Math.round((correct / attempts) * 100) : 0}%</div><div className="text-xs text-stone-500">Accuracy</div></div>
              <div><div className="text-2xl font-bold text-amber-600">{streak}</div><div className="text-xs text-stone-500">Streak</div></div>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <strong>Look closely.</strong> Dots are part of the letter. One, two, or three dots can turn the same basic shape into a different letter.
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 text-sm text-stone-500">Practising all <strong className="text-stone-800">{alphabet.length}</strong> {languageDetails[language].noun} letters.</div>
        </aside>
      </div>
    </section>
  );
};

export default function ArabicAlphabet() {
  const [language, setLanguage] = useState<ScriptLanguage>("arabic");
  const [view, setView] = useState<View>("library");
  const [selectedLetter, setSelectedLetter] = useState<AlphabetLetter | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const alphabet = alphabetByLanguage[language];
  const [question, setQuestion] = useState(() => makeQuestion(alphabetByLanguage.arabic));

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const voice = useMemo(() => {
    const languageCode = languageDetails[language].code;
    return voices.find((item) => item.lang.toLowerCase().startsWith(languageCode));
  }, [language, voices]);

  const changeLanguage = (nextLanguage: ScriptLanguage) => {
    setLanguage(nextLanguage);
    setSelectedLetter(null);
    setQuestion(makeQuestion(alphabetByLanguage[nextLanguage]));
  };

  return (
    <div lang="en" dir="ltr" className="min-h-screen bg-[#f7f5ef] text-stone-900">
      <Navbar />

      <main>
        <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
          <Pattern />
          <GeometricStar className="absolute -right-20 -top-24 h-80 w-80 text-amber-300 opacity-20" />
          <GeometricStar className="absolute -bottom-24 left-[42%] h-64 w-64 text-emerald-300 opacity-15" />
          <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-900/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
                <LuSparkles className="text-amber-300" aria-hidden="true" /> Script garden
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Learn the <span className="text-amber-300">Arabic script</span></h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-100 sm:text-lg">Discover every letter, understand how its shape flows through a word, and train your eye with quick recognition practice.</p>
            </div>
            <div className="grid w-fit grid-cols-2 overflow-hidden rounded-[1.7rem] border border-white/15 bg-white/10 backdrop-blur-sm">
              <div className="px-6 py-4 text-center"><div className="text-3xl font-bold text-amber-300">{alphabet.length}</div><div className="text-xs text-emerald-100">Letters</div></div>
              <div className="border-l border-white/15 px-6 py-4 text-center"><div className="text-3xl font-bold text-amber-300">4</div><div className="text-xs text-emerald-100">Forms</div></div>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 h-8 w-48 -translate-x-1/2 rounded-t-[6rem] bg-[#f7f5ef] sm:w-72" />
        </section>

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8">
          <div className="mb-10 flex flex-col items-center justify-between gap-5 rounded-[1.6rem] border border-emerald-100 bg-white p-3 shadow-[0_8px_30px_rgba(6,78,59,0.06)] sm:flex-row">
            <div className="flex w-full rounded-2xl bg-stone-100 p-1 sm:w-auto">
              <button type="button" onClick={() => setView("library")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition sm:flex-none ${view === "library" ? "bg-white text-emerald-900 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}>
                <LuLibraryBig aria-hidden="true" /> Letter library
              </button>
              <button type="button" onClick={() => setView("quiz")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition sm:flex-none ${view === "quiz" ? "bg-white text-emerald-900 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}>
                <LuCircleHelp aria-hidden="true" /> Recognition quiz
              </button>
            </div>
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-stone-400"><LuLanguages aria-hidden="true" /> Target</span>
              <LanguageSwitch language={language} onChange={changeLanguage} />
            </div>
          </div>

          {view === "library" ? (
            <LetterLibrary alphabet={alphabet} language={language} onSelect={setSelectedLetter} />
          ) : (
            <Quiz key={language} alphabet={alphabet} language={language} question={question} onNext={() => setQuestion(makeQuestion(alphabet))} />
          )}

          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm leading-6 text-stone-600 sm:flex-row sm:items-center">
            <div className="flex max-w-3xl gap-3"><LuInfo className="mt-1 shrink-0 text-emerald-700" aria-hidden="true" /><p><strong className="text-stone-800">A note on sound and writing:</strong> short vowels are usually omitted in everyday Arabic and Persian writing. Pronunciation can also vary by region. Audio uses a free voice installed in your browser, when available.</p></div>
            <div className="flex shrink-0 items-center gap-2 text-xs font-bold text-emerald-800"><GeometricStar className="h-7 w-7" /> Read right to left</div>
          </div>
        </div>
      </main>

      {selectedLetter && <LetterDialog letter={selectedLetter} language={language} voice={voice} onClose={() => setSelectedLetter(null)} />}
    </div>
  );
}
