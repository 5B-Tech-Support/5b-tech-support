import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getClue, TOTAL_CLUES } from "@/lib/puzzle/clues";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-puzzle-token")?.value;

  if (!token) {
    return NextResponse.json({ registered: false });
  }

  const { data: player, error } = await supabaseAdmin
    .from("puzzle_players")
    .select(
      "ign, entry_confirmed, current_clue, completed, completed_at, wrong_attempts, registered_at"
    )
    .eq("player_token", token)
    .single();

  if (error || !player) {
    return NextResponse.json({ registered: false });
  }

  const clue = player.completed ? null : getClue(player.current_clue);

  return NextResponse.json({
    registered: true,
    ign: player.ign,
    entry_confirmed: player.entry_confirmed,
    current_clue: player.current_clue,
    total_clues: TOTAL_CLUES,
    completed: player.completed,
    completed_at: player.completed_at,
    wrong_attempts: player.wrong_attempts,
    registered_at: player.registered_at,
    clue: clue
      ? { number: clue.number, text: clue.text, hint: clue.hint }
      : null,
  });
}
