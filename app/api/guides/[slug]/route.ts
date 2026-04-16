import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data: guide, error } = await supabaseAdmin
      .from("guides")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    const { data: related } = await supabaseAdmin
      .from("guides")
      .select("slug, title, description, category, estimated_minutes, difficulty, tier_required, thumbnail_url")
      .eq("is_published", true)
      .eq("category", guide.category)
      .neq("slug", slug)
      .limit(3);

    return NextResponse.json({ guide, related: related ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
