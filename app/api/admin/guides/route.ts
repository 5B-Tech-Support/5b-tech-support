import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/require-admin";

export async function GET(request: Request) {
  try {
    const admin = await requireAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
    const offset = (page - 1) * limit;
    const tab = searchParams.get("tab") ?? "all";

    let query = supabaseAdmin
      .from("guides")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false });

    if (tab === "published") {
      query = query.eq("is_published", true).is("deleted_at", null);
    } else if (tab === "drafts") {
      query = query.eq("is_published", false).is("deleted_at", null);
    } else if (tab === "deleted") {
      query = query.not("deleted_at", "is", null);
    } else {
      query = query.is("deleted_at", null);
    }

    const { data: guides, count } = await query.range(offset, offset + limit - 1);

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
    const admin = await requireAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const slugFromField =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        : "";

    const slug =
      slugFromField ||
      (body.title ?? "")
        .toLowerCase()
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
        video_url: body.video_url ?? null,
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
