import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const COOKIE = "sb-puzzle-token";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const ign = typeof body.ign === "string" ? body.ign.trim() : "";
  const discord = typeof body.discord === "string" ? body.discord.trim() : null;

  if (!ign || ign.length < 2 || ign.length > 16) {
    return NextResponse.json({ error: "IGN must be 2–16 characters." }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(ign)) {
    return NextResponse.json(
      { error: "IGN can only contain letters, numbers, and underscores." },
      { status: 400 }
    );
  }

  const ignLower = ign.toLowerCase();

  // Check for existing registration
  const { data: existing } = await supabaseAdmin
    .from("puzzle_players")
    .select("id, player_token")
    .eq("ign_lower", ignLower)
    .single();

  if (existing) {
    // Re-issue cookie for returning player (e.g. they lost their cookie)
    const response = NextResponse.json({ success: true, returning: true });
    response.cookies.set(COOKIE, existing.player_token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  }

  const playerToken = crypto.randomUUID();

  const { error } = await supabaseAdmin.from("puzzle_players").insert({
    ign,
    ign_lower: ignLower,
    discord: discord || null,
    player_token: playerToken,
    entry_confirmed: true,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "That IGN is already registered." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Registration failed. Try again." }, { status: 500 });
  }

  const response = NextResponse.json({ success: true, returning: false });
  response.cookies.set(COOKIE, playerToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}
