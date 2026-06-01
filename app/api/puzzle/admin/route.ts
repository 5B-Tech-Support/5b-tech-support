import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/require-admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("puzzle_players")
    .select("id, ign, discord, entry_confirmed, current_clue, completed, registered_at")
    .order("registered_at", { ascending: false });

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ players: data });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const { id, entry_confirmed } = body ?? {};

  if (!id || typeof entry_confirmed !== "boolean") {
    return NextResponse.json({ error: "Missing id or entry_confirmed" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("puzzle_players")
    .update({ entry_confirmed })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}
