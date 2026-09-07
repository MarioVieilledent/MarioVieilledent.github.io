import { useMemo, useState, type FormEvent } from "react";
import { LuArrowRight, LuCircleHelp, LuTrophy } from "react-icons/lu";
import type { CountryType } from "../../utils/validator";
import { normalizeCountryAnswer } from "../../utils/countrySearch";
import CountryShape from "./CountryShape";

export type QuizMode = "flag" | "outline" | "capital";

type QuizCountry = CountryType & {
  threeLetterCode: string;
};

type CountryQuizProps = {
  countries: QuizCountry[];
  shapes: Record<string, string>;
  mode: QuizMode;
};

type Feedback = {
  correct: boolean;
  answer: string;
} | null;

const COUNTRY_ALIASES: Record<string, string[]> = {
  CIV: ["Ivory Coast"],
  COD: ["DR Congo", "Congo Kinshasa"],
  COG: ["Congo", "Congo Brazzaville"],
  CZE: ["Czechia"],
  FSM: ["Micronesia"],
  GBR: ["UK", "Great Britain", "Britain"],
  KOR: ["Republic of Korea"],
  LAO: ["Laos"],
  MKD: ["Macedonia"],
  PRK: ["DPRK", "Democratic People's Republic of Korea"],
  PSE: ["Palestine"],
  RUS: ["Russian Federation"],
  SWZ: ["Swaziland"],
  TUR: ["Turkey"],
  TWN: ["Republic of China"],
  USA: ["US", "USA", "United States"],
  VAT: ["Vatican City"],
  VNM: ["Viet Nam"],
};

const MODE_COPY: Record<
  QuizMode,
  { eyebrow: string; prompt: string; placeholder: string }
> = {
  flag: {
    eyebrow: "Flag challenge",
    prompt: "Which country flies this flag?",
    placeholder: "Type the country name",
  },
  outline: {
    eyebrow: "Outline challenge",
    prompt: "Which country has this outline?",
    placeholder: "Type the country name",
  },
  capital: {
    eyebrow: "Capital challenge",
    prompt: "Which country is this the capital of?",
    placeholder: "Type the country name",
  },
};

const randomIndex = (length: number, excludedIndex = -1) => {
  if (length <= 1) return 0;
  let nextIndex = Math.floor(Math.random() * length);
  while (nextIndex === excludedIndex) {
    nextIndex = Math.floor(Math.random() * length);
  }
  return nextIndex;
};

const CountryQuiz = ({ countries, shapes, mode }: CountryQuizProps) => {
  const eligibleCountries = useMemo(
    () =>
      countries.filter(
        (country) =>
          (mode !== "outline" || Boolean(shapes[country.threeLetterCode])) &&
          (mode !== "capital" || Boolean(country.capital)),
      ),
    [countries, mode, shapes],
  );
  const [questionIndex, setQuestionIndex] = useState(() =>
    randomIndex(eligibleCountries.length),
  );
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });
  const country = eligibleCountries[questionIndex] ?? eligibleCountries[0];
  const copy = MODE_COPY[mode];

  const checkAnswer = (event: FormEvent) => {
    event.preventDefault();

    if (feedback) {
      nextQuestion();
      return;
    }

    const normalizedGuess = normalizeCountryAnswer(guess);
    if (!normalizedGuess || !country) return;

    const acceptedAnswers = [
      country.name,
      ...(COUNTRY_ALIASES[country.threeLetterCode] ?? []),
    ].map(normalizeCountryAnswer);
    const correct = acceptedAnswers.includes(normalizedGuess);

    setFeedback({ correct, answer: country.name });
    setScore((current) => ({
      correct: current.correct + (correct ? 1 : 0),
      attempted: current.attempted + 1,
    }));
  };

  const revealAnswer = () => {
    if (!country || feedback) return;
    setFeedback({ correct: false, answer: country.name });
    setScore((current) => ({
      ...current,
      attempted: current.attempted + 1,
    }));
  };

  const nextQuestion = () => {
    setQuestionIndex((current) => randomIndex(eligibleCountries.length, current));
    setGuess("");
    setFeedback(null);
  };

  if (!country) {
    return <p className="py-16 text-center text-stone-500">No quiz data available.</p>;
  }

  return (
    <section className="mx-auto w-full max-w-2xl py-6 sm:py-10">
      <div className="mb-4 flex items-center justify-between text-sm text-stone-500">
        <span className="font-semibold uppercase tracking-widest text-emerald-700">
          {copy.eyebrow}
        </span>
        <span className="flex items-center gap-1.5">
          <LuTrophy aria-hidden="true" />
          {score.correct} / {score.attempted}
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="flex min-h-72 items-center justify-center bg-stone-50 p-8 sm:min-h-80 sm:p-12">
          {mode === "flag" && (
            <img
              src={`/flags/${country.code}.svg`}
              alt="Flag to identify"
              className="max-h-48 w-full max-w-sm rounded-xl object-contain shadow-md"
            />
          )}
          {mode === "outline" && (
            <CountryShape
              path={shapes[country.threeLetterCode]}
              label="Country outline to identify"
              className="h-56 w-full max-w-sm text-emerald-800"
            />
          )}
          {mode === "capital" && (
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">
                Capital city
              </p>
              <p className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
                {country.capital}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={checkAnswer} className="space-y-5 p-6 sm:p-8">
          <div>
            <label
              htmlFor={`${mode}-answer`}
              className="mb-2 block text-lg font-semibold text-stone-900"
            >
              {copy.prompt}
            </label>
            <input
              id={`${mode}-answer`}
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              placeholder={copy.placeholder}
              autoComplete="off"
              autoFocus
              disabled={Boolean(feedback)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:bg-stone-50"
            />
          </div>

          <div aria-live="polite" className="min-h-7">
            {feedback && (
              <p
                className={
                  feedback.correct
                    ? "font-medium text-emerald-700"
                    : "font-medium text-rose-700"
                }
              >
                {feedback.correct
                  ? `Correct — ${feedback.answer}!`
                  : `The answer is ${feedback.answer}.`}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!feedback && !guess.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {feedback ? "Next country" : "Check answer"}
              {feedback && <LuArrowRight aria-hidden="true" />}
            </button>
            {!feedback && (
              <button
                type="button"
                onClick={revealAnswer}
                className="flex items-center gap-2 rounded-xl border border-stone-300 px-5 py-3 font-medium text-stone-600 transition hover:bg-stone-50"
              >
                <LuCircleHelp aria-hidden="true" />
                Reveal
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default CountryQuiz;
