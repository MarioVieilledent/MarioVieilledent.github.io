import { useEffect, useMemo, useState } from "react";
import { turkishWords } from "../turkishWords";

type WordStats = {
  correct: number;
  wrong: number;
};

type StatsMap = Record<number, WordStats>;

const STORAGE_KEY = "turkish-flashcards-stats";

function normalize(str: string) {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function TurkishFlashcards() {
  const [stats, setStats] = useState<StatsMap>({});
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const [current, setCurrent] = useState(() => {
    const index = Math.floor(Math.random() * turkishWords.length);

    return {
      index,
      direction: Math.random() < 0.5 ? "tr-to-en" : "en-to-tr",
    };
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        setStats(JSON.parse(raw));
      } catch {
        console.error(
          `Can't parse JSON from localStorage key = ${STORAGE_KEY}, turkish flashcards`,
        );
      }
    }
  }, []);

  const saveStats = (newStats: StatsMap) => {
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
  };

  const nextCard = () => {
    setAnswer("");
    setFeedback(null);

    setCurrent({
      index: Math.floor(Math.random() * turkishWords.length),
      direction: Math.random() < 0.5 ? "tr-to-en" : "en-to-tr",
    });
  };

  const word = turkishWords[current.index];

  const prompt = current.direction === "tr-to-en" ? word.turkish : word.english;

  const expected =
    current.direction === "tr-to-en" ? word.english : word.turkish;

  const currentStats = useMemo(
    () =>
      stats[current.index] ?? {
        correct: 0,
        wrong: 0,
      },
    [stats, current.index],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const isCorrect = normalize(answer) === normalize(expected);

    const newStats = {
      ...stats,
      [current.index]: {
        correct: (stats[current.index]?.correct ?? 0) + (isCorrect ? 1 : 0),
        wrong: (stats[current.index]?.wrong ?? 0) + (isCorrect ? 0 : 1),
      },
    };

    saveStats(newStats);

    setFeedback(isCorrect ? "correct" : "wrong");
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="rounded-2xl border bg-white p-8 shadow">
        <div className="mb-2 text-sm text-gray-500">
          {current.direction === "tr-to-en"
            ? "Translate to English"
            : "Translate to Turkish"}
        </div>

        <div className="mb-6 text-center text-4xl font-bold">{prompt}</div>

        <div className="mb-6 flex justify-center gap-4 text-sm">
          <div className="rounded bg-green-100 px-3 py-1 text-green-800">
            Correct: {currentStats.correct}
          </div>

          <div className="rounded bg-red-100 px-3 py-1 text-red-800">
            Wrong: {currentStats.wrong}
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            autoFocus
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your translation..."
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
          >
            Check answer
          </button>
        </form>

        {feedback === "correct" && (
          <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-800">
            Correct!
          </div>
        )}

        {feedback === "wrong" && (
          <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-800">
            Wrong.
            <div className="mt-1">
              Expected: <span className="font-semibold">{expected}</span>
            </div>
          </div>
        )}

        {feedback && (
          <button
            onClick={nextCard}
            className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-3 text-white hover:bg-black"
          >
            Next card
          </button>
        )}
      </div>
    </div>
  );
}
