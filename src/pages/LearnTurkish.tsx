import { useState, useEffect, useRef, useCallback } from "react";
import { turkishConversations } from "../turkishSentences";
import { useTranslation } from "../utils/TranslationContext";
import Home from "../components/Home";

interface TurkishSentence {
  turkish: string;
  english: string;
  french: string;
  audioFilePath: string;
  notes?: string;
}

export interface TurkishConversation {
  topic: string;
  sentences: TurkishSentence[];
}

function AudioButton({
  path,
  size = "md",
}: {
  path: string;
  size?: "sm" | "md";
}) {
  const [state, setState] = useState<"idle" | "playing" | "loading">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (state === "playing") {
      audioRef.current?.pause();
      setState("idle");
      return;
    }
    setState("loading");
    const audio = new Audio(`/audio/turkishSentences/${path}`);
    audioRef.current = audio;
    audio.play().catch(() => {});
    setState("playing");
    audio.onended = () => setState("idle");
    audio.onerror = () => setState("idle");
  };

  const sizeClasses = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

  return (
    <button
      onClick={toggle}
      title={state === "playing" ? "Pause" : "Play audio"}
      className={`
        ${sizeClasses} rounded-full flex items-center justify-center
        transition-all duration-200 flex-shrink-0
        ${
          state === "playing"
            ? "bg-amber-400 text-white shadow-lg shadow-amber-200 scale-110"
            : state === "loading"
              ? "bg-stone-200 text-stone-500 cursor-wait"
              : "bg-stone-200 text-stone-600 hover:bg-amber-100 hover:text-amber-700 hover:shadow-md"
        }
      `}
    >
      {state === "playing" ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 translate-x-px"
        >
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      )}
    </button>
  );
}

// ─── SentenceBubble ───────────────────────────────────────────────────────────

function SentenceBubble({
  sentence,
  speaker,
}: {
  sentence: TurkishSentence;
  speaker: 0 | 1;
}) {
  const { language } = useTranslation();
  const isRight = speaker === 1;

  return (
    <div className={`flex gap-3 ${isRight ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`
        w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold mt-0.5
        ${isRight ? "bg-amber-200 text-amber-800" : "bg-stone-200 text-stone-700"}
      `}
      >
        {isRight ? "B" : "A"}
      </div>

      {/* Bubble */}
      <div
        className={`flex flex-col gap-1.5 max-w-[78%] ${isRight ? "items-end" : "items-start"}`}
      >
        <div
          className={`
          rounded-2xl px-4 py-3 relative
          ${
            isRight
              ? "bg-amber-50 border border-amber-200 rounded-tr-sm"
              : "bg-white border border-stone-200 rounded-tl-sm shadow-sm"
          }
        `}
        >
          {/* Turkish — bold and prominent */}
          <p className="text-stone-900 text-[17px] leading-snug font-semibold tracking-wide">
            {sentence.turkish}
          </p>
          {/* English — clear, not faded */}
          <p className="text-stone-600 text-[14px] mt-2 leading-snug">
            {language === "fr" ? sentence.french : sentence.english}
          </p>
          {/* Notes */}
          {sentence.notes && (
            <p className="text-amber-600 text-[12px] mt-1.5 italic font-medium">
              {sentence.notes}
            </p>
          )}
        </div>
        {/* Audio */}
        <AudioButton path={sentence.audioFilePath} size="sm" />
      </div>
    </div>
  );
}

// ─── ConversationView ─────────────────────────────────────────────────────────

function ConversationView({
  convo,
  index,
}: {
  convo: TurkishConversation;
  index: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
        <span className="text-[12px] font-semibold uppercase tracking-widest text-stone-500">
          Conversation {index + 1}
        </span>
        <div className="flex-1 h-px bg-stone-200" />
        <span className="text-[12px] text-stone-400 font-medium">
          {convo.sentences.length} sentences
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {convo.sentences.map((s, i) => (
          <SentenceBubble key={i} sentence={s} speaker={(i % 2) as 0 | 1} />
        ))}
      </div>
    </div>
  );
}

// ─── SearchResultCard ─────────────────────────────────────────────────────────

function SearchResultCard({
  convo,
  index,
  query,
  onClick,
}: {
  convo: TurkishConversation;
  index: number;
  query: string;
  onClick: () => void;
}) {
  const highlight = (text: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 text-amber-900 rounded px-0.5">
          {p}
        </mark>
      ) : (
        p
      ),
    );
  };

  const matchingSentences = convo.sentences.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.turkish.toLowerCase().includes(q) ||
      s.english.toLowerCase().includes(q) ||
      s.french.toLowerCase().includes(q) ||
      s.notes?.toLowerCase().includes(q)
    );
  });

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-stone-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-md transition-all duration-150 group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-semibold uppercase tracking-widest text-stone-500">
          Conversation {index + 1}
        </span>
        <span className="text-[12px] text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Open →
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {matchingSentences.slice(0, 2).map((s, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <p className="text-stone-800 text-[15px] font-semibold">
              {highlight(s.turkish)}
            </p>
            <p className="text-stone-500 text-[13px]">{highlight(s.english)}</p>
          </div>
        ))}
        {matchingSentences.length > 2 && (
          <p className="text-stone-400 text-[12px] font-medium">
            +{matchingSentences.length - 2} more matches
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  conversations,
  activeIndex,
  onSelect,
  isOpen,
  onClose,
}: {
  conversations: TurkishConversation[];
  activeIndex: number | null;
  onSelect: (i: number) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-stone-200 z-30
        flex flex-col transition-transform duration-300
        md:relative md:translate-x-0 md:flex md:z-auto md:h-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-stone-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-[14px] font-bold text-stone-800 tracking-wide">
              Conversations
            </h2>
            <p className="text-[12px] text-stone-500 mt-0.5">
              {conversations.length} total
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-stone-500 hover:text-stone-800 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {conversations.map((convo, i) => (
            <button
              key={i}
              onClick={() => {
                onSelect(i);
                onClose();
              }}
              className={`
                w-full text-left px-5 py-4 transition-all duration-150
                ${
                  activeIndex === i
                    ? "bg-amber-50 border-r-2 border-amber-500"
                    : "hover:bg-stone-50 border-r-2 border-transparent"
                }
              `}
            >
              <p
                className={`text-[14px] font-semibold ${activeIndex === i ? "text-amber-700" : "text-stone-700"}`}
              >
                {convo.topic}
              </p>
              <p className="text-[12px] text-stone-500 mt-0.5 truncate">
                {convo.sentences[0]?.turkish}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {convo.sentences.length} sentences
              </p>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeConvo, setActiveConvo] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<"random" | "search">("random");

  const pickRandom = useCallback(() => {
    const idx = Math.floor(Math.random() * turkishConversations.length);
    setActiveConvo(idx);
    setTab("random");
  }, []);

  useEffect(() => {
    pickRandom();
  }, []);

  const searchResults =
    searchQuery.length >= 2
      ? turkishConversations
          .map((c, i) => ({ convo: c, index: i }))
          .filter(({ convo }) => {
            const q = searchQuery.toLowerCase();
            return convo.sentences.some(
              (s) =>
                s.turkish.toLowerCase().includes(q) ||
                s.english.toLowerCase().includes(q) ||
                s.french.toLowerCase().includes(q) ||
                s.notes?.toLowerCase().includes(q),
            );
          })
      : [];

  return (
    <div
      className="min-h-screen bg-stone-50 flex"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Sidebar */}
      <Sidebar
        conversations={turkishConversations}
        activeIndex={activeConvo}
        onSelect={(i) => {
          setActiveConvo(i);
          setTab("random");
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen md:min-h-0 overflow-hidden">
        {/* Top bar — two rows on mobile, single row on desktop */}
        <header className="bg-white border-b border-stone-200 flex-shrink-0">
          {/* Row 1: hamburger + title (mobile) / hamburger + title + search (desktop) */}
          <div className="px-4 md:px-8 py-3 flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-stone-500 hover:text-stone-800 transition-colors flex-shrink-0"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Back to home */}
            <div className="mr-4">
              <Home />
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-[20px] font-bold text-stone-900 tracking-tight leading-none">
                Türkçe
              </h1>
              <p className="text-[12px] text-stone-500 mt-0.5 tracking-wide font-medium">
                Conversation Practice
              </p>
            </div>

            {/* Search — hidden on mobile (shown in row 2), visible on desktop */}
            <div className="relative hidden md:block w-72">
              <input
                type="text"
                placeholder="Search in all languages…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length >= 2) setTab("search");
                  else setTab("random");
                }}
                className="w-full pl-9 pr-8 py-2.5 text-[14px] bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-amber-400 focus:bg-white transition-all placeholder:text-stone-400 text-stone-800"
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setTab("random");
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: search bar — mobile only */}
          <div className="md:hidden px-4 pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search in all languages…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length >= 2) setTab("search");
                  else setTab("random");
                }}
                className="w-full pl-9 pr-8 py-2.5 text-[15px] bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-amber-400 focus:bg-white transition-all placeholder:text-stone-400 text-stone-800"
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setTab("random");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {tab === "search" ? (
            /* Search results */
            <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
              <p className="text-[13px] font-medium text-stone-500 mb-4 tracking-wide">
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
              {searchResults.length === 0 ? (
                <div className="text-center py-16 text-stone-400">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-[16px] font-medium">No matches found</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {searchResults.map(({ convo, index }) => (
                    <SearchResultCard
                      key={index}
                      convo={convo}
                      index={index}
                      query={searchQuery}
                      onClick={() => {
                        setActiveConvo(index);
                        setSearchQuery("");
                        setTab("random");
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Conversation view */
            <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
              {/* Random button */}
              <div className="flex items-center justify-end mb-5">
                <button
                  onClick={pickRandom}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-300 rounded-full text-[13px] font-semibold text-stone-700 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-all shadow-sm"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
                  </svg>
                  Random conversation
                </button>
              </div>

              {activeConvo !== null && (
                <div className="bg-white rounded-2xl p-4 md:p-6 border border-stone-200 shadow-sm">
                  <ConversationView
                    convo={turkishConversations[activeConvo]}
                    index={activeConvo}
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
