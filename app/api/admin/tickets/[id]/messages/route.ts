import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { body } = await request.json();

    if (!body?.trim()) {
      return NextResponse.json(
        { error: "Message body is required" },
        { status: 400 }
      );
    }

    // Verify ticket exists
    const { data: ticket } = await supabaseAdmin
      .from("support_tickets")
      .select("id")
      .eq("id", ticketId)
      .single();

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    const { data: message, error } = await supabaseAdmin
      .from("support_ticket_messages")
      .insert({
        ticket_id: ticketId,
        user_id: user.id,
        sender_role: "agent",
        body: body.trim(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabaseAdmin
      .from("support_tickets")
      .update({
        last_admin_reply_at: new Date().toISOString(),
        status: "awaiting_response",
      })
      .eq("id", ticketId);

    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
