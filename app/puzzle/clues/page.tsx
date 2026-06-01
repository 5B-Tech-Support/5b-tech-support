import type { Metadata } from "next";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CLUES, TOTAL_CLUES } from "@/lib/puzzle/clues";
import CluesClient from "./clues-client";

export const metadata: Metadata = { title: "Clues — The Great Skyblock Hunt" };

export default async function CluesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-puzzle-token")?.value;

  let player: { ign: string; current_clue: number; completed: boolean } | null = null;

  if (token) {
    const { data } = await supabaseAdmin
      .from("puzzle_players")
      .select("ign, current_clue, completed")
      .eq("player_token", token)
      .single();
    player = data ?? null;
  }

  // Strip answers — only send clue text + hint to client
  const clues = CLUES.map((c) => ({
    number: c.number,
    text: c.text,
    hint: c.hint,
  }));

  return (
    <CluesClient
      clues={clues}
      totalClues={TOTAL_CLUES}
      player={player}
    />
  );
}
