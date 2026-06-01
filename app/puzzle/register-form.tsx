"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PuzzleRegisterForm() {
  const router = useRouter();
  const [ign, setIgn] = useState("");
  const [discord, setDiscord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/puzzle/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ign: ign.trim(), discord: discord.trim() || undefined }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/puzzle/play"), 1500);
  }

  if (done) {
    return (
      <div className="mt-8 glass-strong rounded-2xl p-8 text-center">
        <p className="text-2xl font-bold gradient-text">Registered!</p>
        <p className="mt-2 text-sm text-muted">
          Redirecting you to the puzzle… Wait for your entry to be confirmed before
          you can start.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 glass-strong rounded-2xl p-8 space-y-5">
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold" htmlFor="ign">
          Minecraft IGN <span className="text-danger">*</span>
        </label>
        <input
          id="ign"
          type="text"
          required
          maxLength={16}
          placeholder="YourUsername"
          value={ign}
          onChange={(e) => setIgn(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted">
          Must match the IGN you paid with exactly.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold" htmlFor="discord">
          Discord (optional)
        </label>
        <input
          id="discord"
          type="text"
          maxLength={64}
          placeholder="username#0000"
          value={discord}
          onChange={(e) => setDiscord(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted">
          Useful if the organiser needs to reach you for prize delivery.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
      )}

      <button type="submit" disabled={loading || !ign.trim()} className="btn-primary w-full py-3">
        {loading ? "Registering…" : "Register My Entry"}
      </button>

      <p className="text-center text-xs text-muted">
        Already registered?{" "}
        <a href="/puzzle/play" className="text-primary hover:underline">
          Go to the puzzle →
        </a>
      </p>
    </form>
  );
}
