"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface ClueData {
  number: number;
  text: string;
  hint: string;
}

interface Props {
  ign: string;
  entryConfirmed: boolean;
  currentClue: number;
  totalClues: number;
  completed: boolean;
  completedAt: string | null;
  clue: ClueData | null;
}

export default function PuzzleClient({
  ign,
  entryConfirmed,
  currentClue,
  totalClues,
  completed: initialCompleted,
  completedAt,
  clue: initialClue,
}: Props) {
  const [clue, setClue] = useState<ClueData | null>(initialClue);
  const [clueNumber, setClueNumber] = useState(currentClue);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [completed, setCompleted] = useState(initialCompleted);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (feedback === "correct" && !completed) {
      const t = setTimeout(() => setFeedback(null), 1500);
      return () => clearTimeout(t);
    }
  }, [feedback, completed]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || loading) return;

    setLoading(true);
    setFeedback(null);

    const res = await fetch("/api/puzzle/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setFeedback("wrong");
      return;
    }

    if (!data.correct) {
      setFeedback("wrong");
      setAnswer("");
      inputRef.current?.focus();
      return;
    }

    if (data.completed) {
      setCompleted(true);
      setClue(null);
      return;
    }

    setFeedback("correct");
    setAnswer("");
    setShowHint(false);
    setClue(data.next_clue);
    setClueNumber(data.next_clue.number);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  const progress = Math.round(((clueNumber - 1) / totalClues) * 100);

  // ── Not confirmed yet ──
  if (!entryConfirmed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="glass-strong max-w-md w-full rounded-2xl p-10 text-center">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl text-white"
            style={{ background: "var(--accent-gradient)" }}
          >
            ⏳
          </div>
          <h2 className="text-xl font-bold">Entry Pending</h2>
          <p className="mt-3 text-sm text-muted">
            Hi <strong>{ign}</strong> — your registration is in! We&apos;re waiting to
            verify your 15M coin payment. Check back in a few hours. Once
            confirmed, this page will unlock automatically.
          </p>
          <Link href="/puzzle" className="btn-secondary mt-8 inline-flex px-6 py-2.5 text-sm">
            ← Back to Hunt Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Completed ──
  if (completed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="glass-strong max-w-lg w-full rounded-2xl p-10 text-center animate-glow-pulse">
          <p className="text-6xl">🏆</p>
          <h2 className="mt-4 text-3xl font-bold gradient-text">You finished!</h2>
          <p className="mt-3 text-muted">
            Congratulations, <strong>{ign}</strong>! You solved all {totalClues} clues.
            {completedAt && (
              <>
                {" "}Completed at{" "}
                <span className="font-semibold">
                  {new Date(completedAt).toLocaleString()}
                </span>
                .
              </>
            )}
          </p>
          <p className="mt-4 text-sm text-muted">
            If you&apos;re the first to finish, you&apos;ll receive{" "}
            <strong className="gradient-text">500,000,000 coins</strong> in-game. The organiser
            will contact you via Discord or in-game to deliver the prize.
          </p>
          <Link href="/puzzle/leaderboard" className="btn-primary mt-8 inline-flex px-8 py-3">
            View Leaderboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">
            Playing as <span className="gradient-text">{ign}</span>
          </p>
          <p className="text-sm text-muted">
            Clue <span className="font-bold text-foreground">{clueNumber}</span> of {totalClues}
          </p>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: "var(--accent-gradient)",
            }}
          />
        </div>
      </div>

      {/* Clue card */}
      {clue && (
        <div className={`glass-strong rounded-2xl p-8 transition-all duration-300 ${
          feedback === "wrong" ? "animate-shake border-danger/60" : ""
        } ${feedback === "correct" ? "border-green-500/60" : ""}`}>
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ background: "var(--accent-gradient)" }}
            >
              {clue.number}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted mb-3">
                Clue #{clue.number}
              </p>
              <p className="text-lg leading-relaxed">{clue.text}</p>
            </div>
          </div>

          {showHint && (
            <div className="mt-5 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
              <span className="font-semibold">Hint:</span> {clue.hint}
            </div>
          )}

          {/* Feedback banners */}
          {feedback === "correct" && (
            <div className="mt-5 rounded-xl bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
              ✓ Correct! Loading next clue…
            </div>
          )}
          {feedback === "wrong" && (
            <div className="mt-5 rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
              ✗ Incorrect — try again.
            </div>
          )}

          {/* Answer form */}
          <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer…"
              disabled={loading || feedback === "correct"}
              autoFocus
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !answer.trim() || feedback === "correct"}
              className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {loading ? "…" : "Submit"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              className="text-xs text-muted hover:text-primary transition-colors"
            >
              {showHint ? "Hide hint" : "Show hint"}
            </button>
            <Link href="/puzzle" className="text-xs text-muted hover:text-primary transition-colors">
              ← Hunt home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
