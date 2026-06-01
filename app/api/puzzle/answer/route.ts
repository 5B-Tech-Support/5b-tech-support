import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { checkAnswer, getClue, TOTAL_CLUES } from "@/lib/puzzle/clues";

// Soft rate-limit: max 8 wrong attempts in any rolling 60-second window.
const RATE_WINDOW_SECONDS = 60;
const MAX_WRONG_IN_WINDOW = 8;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-puzzle-token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not registered." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const answer = typeof body?.answer === "string" ? body.answer : "";

  if (!answer.trim()) {
    return NextResponse.json({ error: "Answer cannot be empty." }, { status: 400 });
  }

  const { data: player, error: fetchError } = await supabaseAdmin
    .from("puzzle_players")
    .select(
      "id, entry_confirmed, current_clue, completed, wrong_attempts, last_wrong_at"
    )
    .eq("player_token", token)
    .single();

  if (fetchError || !player) {
    return NextResponse.json({ error: "Player not found." }, { status: 404 });
  }
  if (!player.entry_confirmed) {
    return NextResponse.json(
      { error: "Your entry payment has not been confirmed yet." },
      { status: 403 }
    );
  }
  if (player.completed) {
    return NextResponse.json({ error: "You have already completed the puzzle!" }, { status: 400 });
  }

  // Rate-limit: if last_wrong_at was within the window and attempts are high, block.
  if (player.last_wrong_at) {
    const since =
      (Date.now() - new Date(player.last_wrong_at).getTime()) / 1000;
    if (since < RATE_WINDOW_SECONDS && player.wrong_attempts >= MAX_WRONG_IN_WINDOW) {
      return NextResponse.json(
        { error: "Too many wrong answers. Wait a moment before trying again." },
        { status: 429 }
      );
    }
  }

  const correct = checkAnswer(player.current_clue, answer);

  if (!correct) {
    await supabaseAdmin
      .from("puzzle_players")
      .update({
        wrong_attempts: player.wrong_attempts + 1,
        last_wrong_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      })
      .eq("id", player.id);

    return NextResponse.json({ correct: false });
  }

  // Correct answer — advance
  const nextClue = player.current_clue + 1;
  const completed = nextClue > TOTAL_CLUES;

  await supabaseAdmin
    .from("puzzle_players")
    .update({
      current_clue: completed ? player.current_clue : nextClue,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      wrong_attempts: 0,
      last_wrong_at: null,
      last_active_at: new Date().toISOString(),
    })
    .eq("id", player.id);

  if (completed) {
    return NextResponse.json({ correct: true, completed: true });
  }

  const nextClueData = getClue(nextClue)!;
  return NextResponse.json({
    correct: true,
    completed: false,
    next_clue: {
      number: nextClueData.number,
      text: nextClueData.text,
      hint: nextClueData.hint,
    },
  });
}
