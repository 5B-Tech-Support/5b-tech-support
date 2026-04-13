import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/auth-helpers";

export async function PATCH(
  request: Request,
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

    const { status } = await request.json();

    if (!status || !["approved", "denied"].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be "approved" or "denied"' },
        { status: 400 }
      );
    }

    const { data: deletionRequest, error } = await supabaseAdmin
      .from("account_deletion_requests")
      .update({ status, reviewed_by: user.id })
      .eq("id", id)
      .eq("status", "pending")
      .select()
      .single();

    if (error || !deletionRequest) {
      return NextResponse.json(
        { error: "Deletion request not found or already reviewed" },
        { status: 404 }
      );
    }

    await logAudit(user.id, "deletion_request_reviewed", {
      request_id: id,
      decision: status,
      target_user_id: deletionRequest.user_id,
    });

    return NextResponse.json({ request: deletionRequest });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
