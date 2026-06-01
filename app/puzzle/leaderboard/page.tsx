import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { TOTAL_CLUES } from "@/lib/puzzle/clues";

export const metadata: Metadata = {
  title: "Scoreboard — The Great Skyblock Hunt",
};

export const revalidate = 15;

async function getPlayers() {
  const { data } = await supabaseAdmin
    .from("puzzle_players")
    .select("ign, current_clue, completed, completed_at, registered_at")
    .eq("entry_confirmed", true)
    .order("current_clue", { ascending: false })
    .order("last_active_at", { ascending: true });
  return data ?? [];
}

export default async function LeaderboardPage() {
  const players = await getPlayers();
  const base = { background: "#000000", color: "#ffffff" };

  return (
    <div className="min-h-screen pb-24" style={base}>
      <div className="max-w-2xl mx-auto px-4 pt-12">

        <Link
          href="/puzzle"
          className="text-xs font-bold uppercase tracking-[0.25em] mb-8 inline-block"
          style={{ color: "rgba(0,212,255,0.5)" }}
        >
          ← The Hunt
        </Link>

        {/* Title block */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold uppercase tracking-[0.4em] mb-3"
            style={{ color: "rgba(0,212,255,0.6)" }}
          >
            Hypixel Skyblock Hunt
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            <span className="puzzle-gradient-text">THE SCOREBOARD</span>
          </h1>
          <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            First to complete all {TOTAL_CLUES} clues wins 500,000,000 coins.
            Updated every 15 seconds.
          </p>
        </div>

        {/* Divider */}
        <div
          className="w-full mb-8"
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)",
          }}
        />

        {players.length === 0 ? (
          <p className="text-center text-sm py-12" style={{ color: "rgba(255,255,255,0.3)" }}>
            No hunters registered yet. Be the first.
          </p>
        ) : (
          <div className="space-y-2">
            {players.map((p, i) => {
              const solved = p.completed ? TOTAL_CLUES : Math.max(0, p.current_clue - 1);
              const pct = Math.round((solved / TOTAL_CLUES) * 100);
              const isFirst = i === 0;

              return (
                <div
                  key={p.ign}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: p.completed
                      ? "rgba(0,212,255,0.06)"
                      : isFirst
                      ? "rgba(0,212,255,0.04)"
                      : "rgba(255,255,255,0.015)",
                    border: p.completed
                      ? "1px solid rgba(0,212,255,0.35)"
                      : isFirst
                      ? "1px solid rgba(0,212,255,0.2)"
                      : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center gap-4 px-5 py-4">
                    {/* Rank */}
                    <span
                      className="text-xs font-black w-7 shrink-0 tabular-nums text-center"
                      style={{
                        fontFamily: "var(--font-geist-mono)",
                        color:
                          i === 0
                            ? "#00d4ff"
                            : i === 1
                            ? "rgba(0,212,255,0.6)"
                            : i === 2
                            ? "rgba(0,212,255,0.4)"
                            : "rgba(255,255,255,0.2)",
                      }}
                    >
                      #{i + 1}
                    </span>

                    {/* IGN */}
                    <span
                      className="flex-1 font-bold text-sm truncate"
                      style={{
                        fontFamily: "var(--font-geist-mono)",
                        color: p.completed ? "#00d4ff" : "#ffffff",
                      }}
                    >
                      {p.ign}
                    </span>

                    {/* Status */}
                    {p.completed ? (
                      <span
                        className="text-xs font-black uppercase tracking-wider shrink-0"
                        style={{ color: "#00d4ff" }}
                      >
                        COMPLETE ✓
                      </span>
                    ) : (
                      <span
                        className="text-xs tabular-nums shrink-0"
                        style={{
                          fontFamily: "var(--font-geist-mono)",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {solved}/{TOTAL_CLUES}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: "2px", background: "rgba(255,255,255,0.04)" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: p.completed
                          ? "linear-gradient(90deg,#00d4ff,#7c3aed)"
                          : "linear-gradient(90deg, rgba(0,212,255,0.6), rgba(124,58,237,0.6))",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Divider */}
        <div
          className="w-full mt-10 mb-8"
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)",
          }}
        />

        <div className="text-center">
          <Link href="/puzzle/clues" className="puzzle-btn inline-flex px-8 py-3 text-sm">
            Go to Clues →
          </Link>
        </div>
      </div>
    </div>
  );
}
