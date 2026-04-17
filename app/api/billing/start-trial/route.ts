import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { hasValidBillingGrant } from "@/lib/billing-gate";
import { logAudit } from "@/lib/auth-helpers";
import type { Profile } from "@/types/database";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowed = await hasValidBillingGrant(user.id);
    if (!allowed) {
      return NextResponse.json(
        { error: "Please verify your email from the billing verification page first." },
        { status: 403 }
      );
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const p = profile as Profile;
    if (p.is_complimentary_pro) {
      return NextResponse.json(
        { error: "You already have full Pro access." },
        { status: 400 }
      );
    }

    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .maybeSingle();

    if (subscription) {
      return NextResponse.json(
        { error: "You already have an active subscription." },
        { status: 400 }
      );
    }

    if (p.tier !== "free") {
      return NextResponse.json(
        { error: "A trial is only available on the free plan." },
        { status: 400 }
      );
    }

    if (p.pro_trial_started_at) {
      return NextResponse.json(
        { error: "A trial has already been used on this account." },
        { status: 400 }
      );
    }

    const trialExpiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();
    const proTrialStartedAt = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        tier: "pro",
        trial_expires_at: trialExpiresAt,
        pro_trial_started_at: proTrialStartedAt,
        support_priority: "standard",
      })
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await logAudit(user.id, "billing_start_trial", { tier: "pro", trial_days: 30 });

    return NextResponse.json({ success: true, trial_expires_at: trialExpiresAt });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
