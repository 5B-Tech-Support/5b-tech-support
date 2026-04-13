import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const offset = (page - 1) * limit;

    const status = searchParams.get("status");
    const assignedTo = searchParams.get("assigned_to");

    let query = supabaseAdmin
      .from("support_tickets")
      .select("*, profiles!support_tickets_user_id_fkey(email, full_name)", {
        count: "exact",
      });

    if (status) query = query.eq("status", status);
    if (assignedTo) query = query.eq("assigned_admin_id", assignedTo);

    const { data: tickets, count } = await query
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    return NextResponse.json({
      tickets: tickets ?? [],
      pagination: { page, limit, total: count ?? 0 },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
