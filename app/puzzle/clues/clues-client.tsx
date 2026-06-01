"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface ClueData {
  number: number;
  text: string;
  hint: string;
}

interface Player {
  ign: string;
  current_clue: number;
  completed: boolean;
}

interface Props {
  clues: ClueData[];
  totalClues: number;
  player: Player | null;
}

const base = { background: "#000000", color: "#ffffff" };

export default function CluesClient({ clues, totalClues, player: initialPlayer }: Props) {
  const [player, setPlayer] = useState<Player | null>(initialPlayer);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showIGNModal, setShowIGNModal] = useState(false);
  const [ign, setIgn] = useState("");
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (feedback === "correct") {
      const t = setTimeout(() => setFeedback(null), 1200);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError(null);
    setRegistering(true);
    const res = await fetch("/api/puzzle/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ign: ign.trim() }),
    });
    const data = await res.json();
    setRegistering(false);
    if (!res.ok) { setRegError(data.error ?? "Something went wrong."); return; }
    setPlayer({ ign: ign.trim(), current_clue: 1, completed: false });
    setShowIGNModal(false);
  }

  async function handleAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || loading || !player) return;
    setLoading(true);
    setFeedback(null);

    const res = await fetch("/api/puzzle/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.correct) {
      setFeedback("wrong");
      setAnswer("");
      inputRef.current?.focus();
      return;
    }

    setFeedback("correct");
    setAnswer("");
    setShowHint(false);

    if (data.completed) {
      setPlayer((p) => p ? { ...p, completed: true } : p);
    } else {
      setPlayer((p) => p ? { ...p, current_clue: data.next_clue.number } : p);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  const currentClue = player?.current_clue ?? 1;
  const completed = player?.completed ?? false;

  return (
    <div className="min-h-screen pb-24" style={base}>
      {/* IGN modal */}
      {showIGNModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-sm rounded-2xl p-8 puzzle-card"
            style={{ background: "#0a0a10" }}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] mb-1"
              style={{ color: "rgba(0,212,255,0.7)" }}>The Hunt</p>
            <h2 className="text-xl font-black mb-6">Enter Your IGN</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                className="puzzle-input"
                placeholder="YourMinecraftIGN"
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                required
                maxLength={16}
                autoFocus
              />
              {regError && (
                <p className="text-sm" style={{ color: "#ff4444" }}>{regError}</p>
              )}
              <button type="submit" disabled={registering || !ign.trim()}
                className="puzzle-btn w-full py-3">
                {registering ? "Starting…" : "Begin the Hunt"}
              </button>
              <button type="button" onClick={() => setShowIGNModal(false)}
                className="w-full text-sm py-2"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-4 pt-12 pb-10 max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Link href="/puzzle"
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3 inline-block"
              style={{ color: "rgba(0,212,255,0.5)" }}>
              ← The Hunt
            </Link>
            <h1 className="text-3xl font-black">
              <span className="puzzle-gradient-text">CLUES</span>
            </h1>
          </div>
          <div className="text-right">
            {player ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: "rgba(0,212,255,0.6)" }}>
                  Playing as
                </p>
                <p className="font-black">{player.ign}</p>
                {completed ? (
                  <p className="text-xs mt-1" style={{ color: "#00d4ff" }}>
                    ✓ All {totalClues} solved
                  </p>
                ) : (
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {currentClue - 1} / {totalClues} solved
                  </p>
                )}
              </div>
            ) : (
              <button onClick={() => setShowIGNModal(true)} className="puzzle-btn px-5 py-2 text-sm">
                Start Playing
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {player && (
          <div className="mt-6 h-px w-full rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full transition-all duration-700"
              style={{
                width: `${Math.round(((completed ? totalClues : currentClue - 1) / totalClues) * 100)}%`,
                background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
              }} />
          </div>
        )}
      </div>

      {/* Completed banner */}
      {completed && (
        <div className="max-w-3xl mx-auto px-4 mb-8">
          <div className="rounded-2xl p-6 text-center"
            style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.3)" }}>
            <p className="text-2xl font-black puzzle-gradient-text">YOU DID IT.</p>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              All {totalClues} clues solved. The organiser will reach out in-game to deliver your prize.
            </p>
            <Link href="/puzzle/leaderboard"
              className="puzzle-btn inline-flex mt-4 px-6 py-2.5 text-sm">
              View Scoreboard →
            </Link>
          </div>
        </div>
      )}

      {/* Clue list */}
      <div className="max-w-3xl mx-auto px-4 space-y-2">
        {clues.map((clue) => {
          const isDone = player ? clue.number < currentClue || completed : false;
          const isActive = player ? (clue.number === currentClue && !completed) : false;
          const isLocked = !player || (clue.number > currentClue && !completed);

          return (
            <ClueCard
              key={clue.number}
              clue={clue}
              isDone={isDone}
              isActive={isActive}
              isLocked={isLocked}
              answer={isActive ? answer : ""}
              onAnswerChange={setAnswer}
              onSubmit={handleAnswer}
              loading={loading}
              feedback={isActive ? feedback : null}
              showHint={isActive ? showHint : false}
              onToggleHint={() => setShowHint((v) => !v)}
              inputRef={isActive ? inputRef : undefined}
              onClickLocked={!player ? () => setShowIGNModal(true) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

function ClueCard({
  clue,
  isDone,
  isActive,
  isLocked,
  answer,
  onAnswerChange,
  onSubmit,
  loading,
  feedback,
  showHint,
  onToggleHint,
  inputRef,
  onClickLocked,
}: {
  clue: ClueData;
  isDone: boolean;
  isActive: boolean;
  isLocked: boolean;
  answer: string;
  onAnswerChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  loading: boolean;
  feedback: "correct" | "wrong" | null;
  showHint: boolean;
  onToggleHint: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onClickLocked?: () => void;
}) {
  const num = String(clue.number).padStart(2, "0");

  const cardClass = isActive
    ? "puzzle-card-active"
    : isDone
    ? "puzzle-card-done"
    : isLocked
    ? "puzzle-card-locked"
    : "puzzle-card";

  return (
    <div
      className={`rounded-2xl overflow-hidden ${cardClass} ${feedback === "wrong" ? "animate-shake" : ""}`}
      onClick={isLocked && onClickLocked ? onClickLocked : undefined}
      style={isLocked ? { cursor: onClickLocked ? "pointer" : "default" } : undefined}
    >
      {/* Row */}
      <div className="flex items-center gap-4 px-6 py-4">
        <span
          className="text-sm font-black shrink-0 w-14"
          style={{
            fontFamily: "var(--font-geist-mono)",
            color: isActive
              ? "#00d4ff"
              : isDone
              ? "rgba(0,212,255,0.35)"
              : "rgba(255,255,255,0.15)",
          }}
        >
          CLUE {num}
        </span>

        <span
          className="flex-1 text-sm font-medium truncate"
          style={{
            color: isActive
              ? "rgba(255,255,255,0.85)"
              : isDone
              ? "rgba(255,255,255,0.3)"
              : "rgba(255,255,255,0.12)",
          }}
        >
          {isDone ? "Solved" : isActive ? "Active — answer below" : "Locked"}
        </span>

        <span className="shrink-0 text-base">
          {isDone ? (
            <span style={{ color: "rgba(0,212,255,0.5)" }}>✓</span>
          ) : isActive ? (
            <span style={{ color: "rgba(0,212,255,0.6)" }}>▾</span>
          ) : (
            <LockIcon />
          )}
        </span>
      </div>

      {/* Expanded body — active clue only */}
      {isActive && (
        <div className="px-6 pb-6 pt-1">
          <div
            className="w-full mb-5"
            style={{ height: "1px", background: "rgba(0,212,255,0.1)" }}
          />

          <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.75)" }}>
            {clue.text}
          </p>

          {showHint && (
            <div
              className="rounded-xl px-4 py-3 mb-4 text-sm"
              style={{
                background: "rgba(0,212,255,0.06)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "rgba(0,212,255,0.9)",
              }}
            >
              <span className="font-bold">Hint:</span> {clue.hint}
            </div>
          )}

          {feedback === "correct" && (
            <div
              className="rounded-xl px-4 py-3 mb-4 text-sm font-semibold"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.3)",
                color: "#00d4ff",
              }}
            >
              ✓ Correct! Loading next clue…
            </div>
          )}
          {feedback === "wrong" && (
            <div
              className="rounded-xl px-4 py-3 mb-4 text-sm font-semibold"
              style={{
                background: "rgba(255,60,60,0.08)",
                border: "1px solid rgba(255,60,60,0.3)",
                color: "#ff6b6b",
              }}
            >
              ✗ Incorrect — try again.
            </div>
          )}

          <form onSubmit={onSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              className="puzzle-input flex-1"
              placeholder="Your answer…"
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              disabled={loading || feedback === "correct"}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !answer.trim() || feedback === "correct"}
              className="puzzle-btn px-5 py-2.5 text-sm shrink-0"
            >
              {loading ? "…" : "Submit"}
            </button>
          </form>

          <button
            type="button"
            onClick={onToggleHint}
            className="mt-3 text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            {showHint ? "Hide hint" : "Need a hint?"}
          </button>
        </div>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "rgba(255,255,255,0.1)" }}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
