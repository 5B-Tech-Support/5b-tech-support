import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
    const offset = (page - 1) * limit;
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const tier = searchParams.get("tier");
    const os = searchParams.get("os") ?? "windows11";

    let query = supabaseAdmin
      .from("guides")
      .select("id, slug, title, description, category, os_type, tier_required, difficulty, estimated_minutes, thumbnail_url, is_published, created_at, updated_at", { count: "exact" })
      .eq("is_published", true)
      .eq("os_type", os)
      .is("deleted_at", null);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (category) {
      query = query.eq("category", category);
    }
    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }
    if (tier) {
      query = query.eq("tier_required", tier);
    }

    const { data: guides, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      guides: guides ?? [],
      pagination: { page, limit, total: count ?? 0 },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
