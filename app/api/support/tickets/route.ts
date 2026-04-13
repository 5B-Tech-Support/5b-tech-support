import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const offset = (page - 1) * limit;

    const { data: tickets, count } = await supabaseAdmin
      .from("support_tickets")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
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

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, os_type, issue_category } =
      await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const validOsTypes = ["windows11", "macos"];
    if (os_type && !validOsTypes.includes(os_type)) {
      return NextResponse.json({ error: "Invalid os_type" }, { status: 400 });
    }

    const { data: ticket, error } = await supabaseAdmin
      .from("support_tickets")
      .insert({
        user_id: user.id,
        title,
        description,
        os_type: os_type ?? null,
        issue_category: issue_category ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAudit(user.id, "ticket_created", { ticket_id: ticket.id });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
