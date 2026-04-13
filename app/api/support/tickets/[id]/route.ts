import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: ticket } = await supabaseAdmin
      .from("support_tickets")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    const { data: messages } = await supabaseAdmin
      .from("support_ticket_messages")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true });

    const { data: attachments } = await supabaseAdmin
      .from("support_ticket_attachments")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      ticket,
      messages: messages ?? [],
      attachments: attachments ?? [],
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
