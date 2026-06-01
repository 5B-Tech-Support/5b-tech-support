import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getClue, TOTAL_CLUES } from "@/lib/puzzle/clues";
import PuzzleClient from "./puzzle-client";

export const metadata: Metadata = { title: "The Great Skyblock Hunt — Play" };

export default async function PuzzlePlayPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-puzzle-token")?.value;

  if (!token) {
    redirect("/puzzle#enter");
  }

  const { data: player } = await supabaseAdmin
    .from("puzzle_players")
    .select("ign, entry_confirmed, current_clue, completed, completed_at")
    .eq("player_token", token)
    .single();

  if (!player) {
    redirect("/puzzle#enter");
  }

  const clue = player.completed ? null : getClue(player.current_clue);

  return (
    <PuzzleClient
      ign={player.ign}
      entryConfirmed={player.entry_confirmed}
      currentClue={player.current_clue}
      totalClues={TOTAL_CLUES}
      completed={player.completed}
      completedAt={player.completed_at ?? null}
      clue={clue ? { number: clue.number, text: clue.text, hint: clue.hint } : null}
    />
  );
}
