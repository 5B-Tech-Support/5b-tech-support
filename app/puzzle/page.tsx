import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { TOTAL_CLUES } from "@/lib/puzzle/clues";
import PuzzleRegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "The Great Skyblock Hunt",
  description:
    "A 40-clue Ready Player One–style puzzle hunt set in Hypixel Skyblock. 15M entry · 500M prize.",
};

async function getLeaderboard() {
  const { data } = await supabaseAdmin
    .from("puzzle_players")
    .select("ign, current_clue, completed, completed_at")
    .eq("entry_confirmed", true)
    .order("current_clue", { ascending: false })
    .order("last_active_at", { ascending: true })
    .limit(10);
  return data ?? [];
}

export default async function PuzzleLandingPage() {
  const leaderboard = await getLeaderboard();

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="hero-bg py-24 text-center">
        <div className="relative mx-auto max-w-3xl px-4">
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-widest gradient-text">
            Hypixel Skyblock · Puzzle Hunt
          </p>
          <h1 className="animate-fade-up stagger-1 mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
            The Great{" "}
            <span className="gradient-text">Skyblock Hunt</span>
          </h1>
          <p className="animate-fade-up stagger-2 mx-auto mt-5 max-w-2xl text-muted">
            Forty clues. One winner. Half a billion coins.
            <br />
            Prove you know Skyblock better than anyone — and take home the prize.
          </p>
          <div className="animate-fade-up stagger-3 mt-10 flex flex-wrap items-center justify-center gap-6">
            <div className="glass-strong rounded-2xl px-8 py-4 text-center">
              <p className="text-3xl font-bold gradient-text">500,000,000</p>
              <p className="mt-1 text-sm text-muted">Coin Prize</p>
            </div>
            <div className="glass-strong rounded-2xl px-8 py-4 text-center">
              <p className="text-3xl font-bold">15,000,000</p>
              <p className="mt-1 text-sm text-muted">Entry Fee (coins)</p>
            </div>
            <div className="glass-strong rounded-2xl px-8 py-4 text-center">
              <p className="text-3xl font-bold">{TOTAL_CLUES}</p>
              <p className="mt-1 text-sm text-muted">Total Clues</p>
            </div>
          </div>
          <div className="animate-fade-up stagger-4 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/puzzle/play" className="btn-primary px-8 py-3.5 text-base">
              Continue Playing →
            </Link>
            <a href="#enter" className="btn-secondary px-8 py-3.5 text-base">
              Enter the Hunt
            </a>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest gradient-text">
            How It Works
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
            Solve clues. Advance. Win big.
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                num: "1",
                title: "Pay the entry fee",
                desc: `Send exactly 15,000,000 coins to the hunt organiser in-game, then register below with your IGN. Your entry is confirmed manually.`,
              },
              {
                num: "2",
                title: "Solve 40 clues",
                desc: "Each correct answer unlocks the next clue. All 40 are Hypixel Skyblock themed — no Google-able answers. Real knowledge wins.",
              },
              {
                num: "3",
                title: "First to finish wins",
                desc: "The very first player to answer all 40 clues correctly takes home 500,000,000 coins. Second place gets nothing. Race.",
              },
            ].map((s, i) => (
              <div
                key={s.num}
                className={`glass-strong rounded-2xl p-6 text-center card-hover animate-fade-up stagger-${i + 1}`}
              >
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  {s.num}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rules ── */}
      <section className="hero-bg py-20">
        <div className="relative mx-auto max-w-3xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest gradient-text">
            Rules
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
            Keep it clean. Keep it fair.
          </h2>
          <div className="mt-10 space-y-4">
            {[
              "One entry per Minecraft IGN. Multi-accounting will result in disqualification.",
              "No sharing answers publicly. Help someone else and you're both out.",
              "All 40 clues relate to Hypixel Skyblock. No external puzzle knowledge required.",
              "The entry fee of 15M coins is non-refundable once your registration is confirmed.",
              "The organiser's decision on any dispute is final.",
              "The hunt ends when one player completes all 40 clues and is verified. The 500M is paid in-game.",
            ].map((rule, i) => (
              <div key={i} className="glass rounded-xl p-4 flex gap-3 items-start">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  {i + 1}
                </span>
                <p className="text-sm">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration ── */}
      <section id="enter" className="py-20">
        <div className="mx-auto max-w-lg px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest gradient-text">
            Register
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
            Enter the Hunt
          </h2>
          <p className="mt-3 text-center text-sm text-muted">
            First, send <strong>15,000,000 coins</strong> to{" "}
            <strong className="font-mono">YourIGNHere</strong> in-game with the
            message <em>&ldquo;puzzle entry&rdquo;</em>. Then fill out the form
            below — your entry will be confirmed within a few hours once payment
            is verified.
          </p>
          <PuzzleRegisterForm />
        </div>
      </section>

      {/* ── Leaderboard ── */}
      <section className="hero-bg py-20">
        <div className="relative mx-auto max-w-2xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest gradient-text">
            Leaderboard
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
            Who&apos;s ahead?
          </h2>
          {leaderboard.length === 0 ? (
            <p className="mt-8 text-center text-muted">
              No confirmed entries yet. Be the first!
            </p>
          ) : (
            <div className="mt-10 space-y-3">
              {leaderboard.map((p, i) => (
                <div
                  key={p.ign}
                  className="glass-strong rounded-xl px-5 py-3 flex items-center gap-4"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                      i === 0
                        ? "text-white"
                        : "border border-border text-muted"
                    }`}
                    style={
                      i === 0
                        ? { background: "var(--accent-gradient)" }
                        : undefined
                    }
                  >
                    {i + 1}
                  </span>
                  <span className="font-semibold flex-1">{p.ign}</span>
                  {p.completed ? (
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      COMPLETED ✓
                    </span>
                  ) : (
                    <span className="text-sm text-muted">
                      Clue {p.current_clue} / {TOTAL_CLUES}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/puzzle/leaderboard" className="text-primary hover:underline">
              Full leaderboard →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="gradient-border-top mb-6" />
          <p className="disclaimer text-center">
            This puzzle hunt is a fan-made community event. It is not affiliated with,
            endorsed by, or sponsored by Hypixel or Mojang. Entry fees and prizes are
            handled entirely in-game between players. Participate at your own risk.
          </p>
        </div>
      </section>
    </div>
  );
}
