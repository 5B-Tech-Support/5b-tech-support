"use client";

import { useState } from "react";

interface Player {
  id: string;
  ign: string;
  discord: string | null;
  entry_confirmed: boolean;
  current_clue: number;
  completed: boolean;
  registered_at: string;
}

interface Props {
  players: Player[];
  totalClues: number;
}

export default function PuzzleAdminClient({ players: initial, totalClues }: Props) {
  const [players, setPlayers] = useState<Player[]>(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setConfirmed(id: string, confirmed: boolean) {
    setLoading(id);
    setError(null);
    const res = await fetch("/api/puzzle/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, entry_confirmed: confirmed }),
    });
    setLoading(null);
    if (!res.ok) {
      setError("Failed to update. Try again.");
      return;
    }
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, entry_confirmed: confirmed } : p))
    );
  }

  const pending = players.filter((p) => !p.entry_confirmed);
  const confirmed = players.filter((p) => p.entry_confirmed);

  return (
    <div className="mt-8 space-y-10">
      {error && (
        <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-4">
          Pending Confirmation{" "}
          <span className="ml-1 rounded-full bg-danger/10 px-2 py-0.5 text-xs text-danger">
            {pending.length}
          </span>
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted">All entries confirmed.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((p) => (
              <PlayerRow
                key={p.id}
                player={p}
                totalClues={totalClues}
                loading={loading === p.id}
                onConfirm={() => setConfirmed(p.id, true)}
                onRevoke={() => setConfirmed(p.id, false)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          Confirmed Entries{" "}
          <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {confirmed.length}
          </span>
        </h2>
        {confirmed.length === 0 ? (
          <p className="text-sm text-muted">No confirmed entries yet.</p>
        ) : (
          <div className="space-y-3">
            {confirmed.map((p) => (
              <PlayerRow
                key={p.id}
                player={p}
                totalClues={totalClues}
                loading={loading === p.id}
                onConfirm={() => setConfirmed(p.id, true)}
                onRevoke={() => setConfirmed(p.id, false)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PlayerRow({
  player,
  totalClues,
  loading,
  onConfirm,
  onRevoke,
}: {
  player: Player;
  totalClues: number;
  loading: boolean;
  onConfirm: () => Promise<void>;
  onRevoke: () => Promise<void>;
}) {
  return (
    <div className="glass-strong rounded-xl px-5 py-4 flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{player.ign}</p>
        {player.discord && (
          <p className="text-xs text-muted truncate">{player.discord}</p>
        )}
        <p className="text-xs text-muted">
          Registered {new Date(player.registered_at).toLocaleString()}
        </p>
      </div>
      <div className="text-sm text-muted">
        {player.completed ? (
          <span className="font-bold text-green-600 dark:text-green-400">COMPLETED</span>
        ) : (
          <>Clue {player.current_clue}/{totalClues}</>
        )}
      </div>
      <div className="flex gap-2">
        {player.entry_confirmed ? (
          <button
            onClick={onRevoke}
            disabled={loading}
            className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50"
          >
            Revoke
          </button>
        ) : (
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn-primary px-3 py-1.5 text-xs disabled:opacity-50"
          >
            {loading ? "…" : "Confirm Entry"}
          </button>
        )}
      </div>
    </div>
  );
}
