import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Great Skyblock Hunt",
  description:
    "A Ready Player One–inspired 40-clue puzzle hunt hidden inside Hypixel Skyblock. 500M coins to the first to crack it.",
};

export default function PuzzleLandingPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#000000", color: "#ffffff" }}>
      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center px-4 pt-24 pb-20 text-center">
        <p
          className="text-xs font-bold uppercase tracking-[0.3em] mb-6"
          style={{ color: "rgba(0,212,255,0.7)" }}
        >
          Hypixel Skyblock · Community Event
        </p>

        <h1 className="text-5xl font-black tracking-tight sm:text-7xl leading-none">
          <span className="puzzle-gradient-text">THE GREAT</span>
          <br />
          <span style={{ color: "#ffffff" }}>SKYBLOCK HUNT</span>
        </h1>

        <p
          className="mt-8 max-w-xl text-base leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          In <em>Ready Player One</em>, James Halliday hid three keys inside the OASIS
          — and the world tore itself apart searching for them. This is our version.
          Forty clues buried inside the world of Hypixel Skyblock. Answer them all,
          in order, before anyone else does. First to finish takes the prize.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/puzzle/clues"
            className="puzzle-btn inline-flex items-center gap-2 px-8 py-3.5 text-base rounded-xl"
          >
            Enter the Hunt →
          </Link>
          <Link
            href="/puzzle/leaderboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base rounded-xl font-semibold transition-colors"
            style={{
              border: "1px solid rgba(0,212,255,0.25)",
              color: "rgba(0,212,255,0.9)",
            }}
          >
            Scoreboard
          </Link>
        </div>
      </section>

      {/* ── Divider ── */}
      <div
        className="mx-auto w-full max-w-3xl px-4"
        style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)" }}
      />

      {/* ── Overview ── */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <div className="grid gap-8 sm:grid-cols-3 text-center">
          {[
            { value: "500,000,000", label: "Coin Prize" },
            { value: "40", label: "Clues to Solve" },
            { value: "1", label: "Winner Takes All" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl py-8 puzzle-card"
            >
              <p className="text-4xl font-black puzzle-gradient-text">{item.value}</p>
              <p className="mt-2 text-sm font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2
          className="text-xs font-bold uppercase tracking-[0.3em] mb-10 text-center"
          style={{ color: "rgba(0,212,255,0.7)" }}
        >
          How It Works
        </h2>
        <div className="space-y-4">
          {[
            {
              n: "01",
              title: "Enter your IGN",
              body: "Visit the Clues page and enter your Minecraft username to begin. Your progress is saved automatically.",
            },
            {
              n: "02",
              title: "Solve clue #1",
              body: "All 40 clues are Hypixel Skyblock–specific. No external research needed — just genuine Skyblock knowledge. Answer correctly to unlock the next.",
            },
            {
              n: "03",
              title: "Race to the finish",
              body: "The leaderboard is live. Everyone can see who's ahead. The first player to answer all 40 clues correctly wins 500,000,000 coins — delivered in-game.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-2xl p-6 puzzle-card flex gap-5 items-start"
            >
              <span
                className="text-2xl font-black shrink-0 tabular-nums"
                style={{ fontFamily: "var(--font-geist-mono)", color: "rgba(0,212,255,0.35)" }}
              >
                {step.n}
              </span>
              <div>
                <p className="font-semibold" style={{ color: "#ffffff" }}>{step.title}</p>
                <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-3xl px-4 pb-24 text-center">
        <p className="text-lg font-semibold mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
          The egg is out there.
        </p>
        <Link href="/puzzle/clues" className="puzzle-btn inline-flex px-10 py-4 text-base rounded-xl">
          Begin →
        </Link>
      </section>
    </div>
  );
}
