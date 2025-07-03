import React, { useState, useEffect } from "react";
import type { Word } from "../types";
import { words } from "../words";
import { useTranslation } from "../utils/TranslationContext";

type Stats = {
  success: number;
  failure: number;
};

const STORAGE_KEY = "learnNorwegianStats";

const LearnNorwegian = () => {
  const { t } = useTranslation();

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

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const pickRandomQuestion = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const direction = Math.random() < 0.5 ? "en-nb" : "nb-en";
    setQuestion({ word: randomWord, direction });
    setAnswer("");
    setFeedback(null);
  };

  useEffect(() => {
    pickRandomQuestion();
  }, [words]);

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
        ? `Correct. ${
            question.direction === "en-nb"
              ? question.word.english.toLowerCase()
              : question.word.norwegian.toLowerCase()
          } = ${correct}`
        : `Wrong. Correct answer: ${correct}`
    );

    setStats((prev) => {
      const key = question.word.norwegian;
      const prevStats = prev[key] || { success: 0, failure: 0 };
      return {
        ...prev,
        [key]: {
          success: prevStats.success + (isCorrect ? 1 : 0),
          failure: prevStats.failure + (isCorrect ? 0 : 1),
        },
      };
    });
  };

  if (!question) return <div>{`${t("loading")}...`}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {t("translateThisWord")}
      </h2>
      <div className="flex gap-2 items-center mb-6">
        <img
          className="w-6"
          src={`/${question.direction === "en-nb" ? "en" : "nb"}.png`}
          alt={`Language icon ${question.direction === "en-nb" ? "en" : "nb"}`}
        />
        <span className="text-lg">
          {question.direction === "en-nb"
            ? `${t("english")}: ${question.word.english}`
            : `${t("norwegian")}: ${question.word.norwegian}`}
        </span>
      </div>
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
                feedback.startsWith("Correct")
                  ? "text-green-600"
                  : "text-red-600"
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
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t("submit")}
          </button>
        )}
      </form>
    </div>
  );
};

export default LearnNorwegian;
