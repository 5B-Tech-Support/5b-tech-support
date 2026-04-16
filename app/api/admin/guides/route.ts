import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!profile || !["admin", "super_admin"].includes(profile.role)) return null;
  return user;
}

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
    const offset = (page - 1) * limit;

    const { data: guides, count } = await supabaseAdmin
      .from("guides")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

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

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const slug = body.slug || body.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!body.title || !body.description || !body.category) {
      return NextResponse.json(
        { error: "title, description, and category are required" },
        { status: 400 }
      );
    }

    const { data: guide, error } = await supabaseAdmin
      .from("guides")
      .insert({
        slug,
        title: body.title,
        description: body.description,
        category: body.category,
        os_type: body.os_type ?? "windows11",
        tier_required: body.tier_required ?? "free",
        difficulty: body.difficulty ?? "beginner",
        estimated_minutes: body.estimated_minutes ?? 5,
        thumbnail_url: body.thumbnail_url ?? null,
        content: body.content ?? "",
        is_published: body.is_published ?? false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ guide }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
