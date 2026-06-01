import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { TOTAL_CLUES } from "@/lib/puzzle/clues";

export const metadata: Metadata = {
  title: "Leaderboard — The Great Skyblock Hunt",
};

export const revalidate = 30;

async function getAll() {
  const { data } = await supabaseAdmin
    .from("puzzle_players")
    .select("ign, current_clue, completed, completed_at, registered_at")
    .eq("entry_confirmed", true)
    .order("current_clue", { ascending: false })
    .order("last_active_at", { ascending: true });
  return data ?? [];
}

export default async function LeaderboardPage() {
  const players = await getAll();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/puzzle" className="text-sm text-muted hover:text-primary transition-colors">
        ← Hunt home
      </Link>

      <h1 className="mt-6 text-3xl font-bold">
        Hunt <span className="gradient-text">Leaderboard</span>
      </h1>
      <p className="mt-2 text-sm text-muted">
        Showing all confirmed entrants, ranked by furthest clue reached.
      </p>

      {players.length === 0 ? (
        <p className="mt-12 text-center text-muted">No confirmed entries yet.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {players.map((p, i) => {
            const pct = Math.round(
              (p.completed ? TOTAL_CLUES : p.current_clue - 1) / TOTAL_CLUES * 100
            );
            return (
              <div
                key={p.ign}
                className="glass-strong rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-4 px-5 py-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                      i === 0 ? "text-white" : "border border-border text-muted"
                    }`}
                    style={i === 0 ? { background: "var(--accent-gradient)" } : undefined}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 font-semibold">{p.ign}</span>
                  {p.completed ? (
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">
                      FINISHED ✓
                    </span>
                  ) : (
                    <span className="text-sm text-muted">
                      {p.current_clue - 1} / {TOTAL_CLUES} solved
                    </span>
                  )}
                </div>
                <div className="h-1 w-full bg-border">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: p.completed
                        ? "linear-gradient(90deg, #16a34a, #22c55e)"
                        : "var(--accent-gradient)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-muted">
        Leaderboard refreshes every 30 seconds.
      </p>
    </div>
  );
}
