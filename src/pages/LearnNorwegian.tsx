import React, { useState, useEffect } from "react";
import type { Word } from "../types";
import { words } from "../words";
import { useTranslation } from "../utils/TranslationContext";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router";

type Stats = {
  success: number;
  failure: number;
};

const STORAGE_KEY = "learnNorwegianStats";

const LearnNorwegian = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<{
    word: Word;
    direction: "en-nb" | "nb-en";
  } | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, Stats>>({});

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const pickRandomQuestion = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const direction = Math.random() < 0.5 ? "en-nb" : "nb-en";
    setQuestion({ word: randomWord, direction });
    setAnswer("");
    setFeedback(null);
  };

  useEffect(() => {
    pickRandomQuestion();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    const correct =
      question.direction === "en-nb"
        ? question.word.norwegian.toLowerCase()
        : question.word.english.toLowerCase();

    const isCorrect =
      answer.length > 1 && correct.includes(answer.trim().toLowerCase());

    setFeedback(
      isCorrect
        ? `${
            question.direction === "en-nb"
              ? question.word.english.toLowerCase()
              : question.word.norwegian.toLowerCase()
          } = ${correct}`
        : `Correct answer: ${correct}`
    );

    const key = question.word.norwegian;
    const prevStats = stats[key] || { success: 0, failure: 0 };
    const updatedStats = {
      ...stats,
      [key]: {
        success: prevStats.success + (isCorrect ? 1 : 0),
        failure: prevStats.failure + (isCorrect ? 0 : 1),
      },
    };
    setStats(updatedStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats));
  };

  if (!question) return <div>{`${t("loading")}...`}</div>;

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex flex-col gap-4 max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
        <a
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <LuChevronLeft size="24" />
          {t("goBackHome")}
        </a>
        <div className="flex justify-between">
          <span>{`${words.length} ${t("words")}`}</span>
          <span>{`${Object.values(stats).reduce(
            (acc, s) => s.success + acc,
            0
          )} ${t("success")}`}</span>
          <span>{`${Object.values(stats).reduce(
            (acc, s) => s.failure + acc,
            0
          )} ${t("failure")}`}</span>
        </div>
        <h2 className="text-2xl  text-center text-gray-500">
          {t("translateThisWord")}
        </h2>
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2 items-center">
            <img
              className="w-6"
              src={`/${question.direction === "en-nb" ? "en" : "nb"}.png`}
              alt={`Language icon ${
                question.direction === "en-nb" ? "en" : "nb"
              }`}
            />
            <span className="text-lg font-bold">
              {question.direction === "en-nb"
                ? `${t("english")}: ${question.word.english}`
                : `${t("norwegian")}: ${question.word.norwegian}`}
            </span>
          </div>
          <span>{`${stats[question.word.english]?.success ?? 0}/${
            stats[question.word.english]?.failure ?? 0
          }`}</span>
        </div>
        <span>{question.word.partOfSpeech}</span>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4"
        >
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${t("typeYourTranslation")}...`}
          />
          {feedback ? (
            <div className="mt-6 text-center">
              <p
                className={`text-lg font-medium ${
                  feedback.startsWith("Correct answer")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {feedback}
              </p>
              <button
                onClick={pickRandomQuestion}
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                {t("next")}
              </button>
            </div>
          ) : answer ? (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t("submit")}
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t("iDontKnow")}
            </button>
          )}
        </form>
      </div>

      <div className="w-full grow">
        {feedback && (
          <iframe
            className="w-full h-full"
            src={`https://naob.no/ordbok/${encodeURIComponent(
              removeArtefacts(question.word.norwegian)
            )}`}
          ></iframe>
        )}
      </div>
    </div>
  );
};

const removeArtefacts = (wordWithArtefacts: string): string => {
  return wordWithArtefacts
    .replace("Å ", "")
    .replace(" (en)", "")
    .replace(" (et)", "");
};

export default LearnNorwegian;
