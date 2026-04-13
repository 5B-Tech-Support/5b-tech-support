import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "pending";

    const { data: requests } = await supabaseAdmin
      .from("account_deletion_requests")
      .select("*, profiles!account_deletion_requests_user_id_fkey(email, full_name)")
      .eq("status", status)
      .order("created_at", { ascending: false });

    return NextResponse.json({ requests: requests ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
