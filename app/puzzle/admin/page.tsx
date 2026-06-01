import { redirect } from "next/navigation";
import { userIsAdmin } from "@/lib/require-admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { TOTAL_CLUES } from "@/lib/puzzle/clues";
import PuzzleAdminClient from "./admin-client";

export default async function PuzzleAdminPage() {
  const isAdmin = await userIsAdmin();
  if (!isAdmin) redirect("/login");

  const { data: players } = await supabaseAdmin
    .from("puzzle_players")
    .select("id, ign, discord, entry_confirmed, current_clue, completed, registered_at")
    .order("registered_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">
        Puzzle Hunt <span className="gradient-text">Admin</span>
      </h1>
      <p className="mt-1 text-sm text-muted">
        Confirm entries after verifying 15M coin payment in-game.
      </p>
      <PuzzleAdminClient players={players ?? []} totalClues={TOTAL_CLUES} />
    </div>
  );
}
