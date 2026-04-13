import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const offset = (page - 1) * limit;
    const search = searchParams.get("search");

    let query = supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact" });

    if (search) {
      query = query.or(
        `email.ilike.%${search}%,full_name.ilike.%${search}%`
      );
    }

    const { data: users, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    return NextResponse.json({
      users: users ?? [],
      pagination: { page, limit, total: count ?? 0 },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
