import React, { useState, useEffect } from "react";
import type { WordNorwegian } from "../types";
import { wordsNorwegian } from "../wordsNorwegian";
import { useTranslation } from "../utils/TranslationContext";
import LanguageSelection from "../components/LanguageSelection";
import Home from "../components/Home";
import { useIsMobile } from "../utils/isMobileHook";

type Stats = {
  success: number;
  failure: number;
};

const STORAGE_KEY = "learnNorwegianStats";

const LearnNorwegian = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const [search, setSearch] = useState("");

  const [question, setQuestion] = useState<{
    word: WordNorwegian;
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
    const randomWord =
      wordsNorwegian[Math.floor(Math.random() * wordsNorwegian.length)];
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
      <div
        className={
          isMobile
            ? "flex flex-col gap-8 py-4"
            : "flex justify-center gap-8 py-4"
        }
      >
        <div className="flex flex-col gap-4 max-w-md p-6 bg-white rounded-2xl shadow-lg">
          <div className="flex gap-8">
            <Home />
            <LanguageSelection />
          </div>
          <h2 className="text-2xl  text-center text-gray-500">
            {t("translateThisWord")}
          </h2>
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2 items-center">
              <img
                className="w-6"
                src={`/flags/${
                  question.direction === "en-nb" ? "gb" : "no"
                }.svg`}
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
            {feedback && question.word.note && (
              <>
                <span>{t("note")}</span>
                <span className="text-sm">{question.word.note}</span>
              </>
            )}
          </form>
        </div>

        <div className="flex flex-col gap-2 max-w-120 max-h-100 self-center p-6 bg-white rounded-2xl shadow-lg">
          <span>{t("statistics")}</span>
          <div className="flex justify-between">
            <span className="text-sm">{`${wordsNorwegian.length} ${t(
              "words"
            )}`}</span>
            <span className="text-sm text-green-800">{`${Object.values(
              stats
            ).reduce((acc, s) => s.success + acc, 0)} ${t("success")}`}</span>
            <span className="text-sm text-red-800">{`${Object.values(
              stats
            ).reduce((acc, s) => s.failure + acc, 0)} ${t("failure")}`}</span>
          </div>
          <div className="flex gap-4">
            <span>{t("listOfWords")}</span>
            <input
              placeholder={t("searchHere")}
              type="text"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-col overflow-auto">
            {wordsNorwegian
              .filter(
                (word) =>
                  word.norwegian
                    .toLocaleLowerCase()
                    .trim()
                    .includes(search.toLocaleLowerCase().trim()) ||
                  word.english
                    .toLocaleLowerCase()
                    .trim()
                    .includes(search.toLocaleLowerCase().trim())
              )
              .sort((a, b) => {
                const aFails =
                  Object.entries(stats).find((s) => s[0] === a.norwegian)?.[1]
                    .failure ?? 0;
                const bFails =
                  Object.entries(stats).find((s) => s[0] === b.norwegian)?.[1]
                    .failure ?? 0;
                return aFails < bFails ? 1 : -1;
              })
              .map((word, index) => (
                <div className="flex gap-1" key={index}>
                  <span className="text-xs text-green-800">
                    {Object.entries(stats).find(
                      (s) => s[0] === word.norwegian
                    )?.[1].success ?? 0}
                  </span>
                  <span className="text-xs text-red-800">
                    {Object.entries(stats).find(
                      (s) => s[0] === word.norwegian
                    )?.[1].failure ?? 0}
                  </span>
                  <span className="text-xs">{`${word.norwegian} = ${word.english}`}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {!isMobile && (
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
      )}
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
