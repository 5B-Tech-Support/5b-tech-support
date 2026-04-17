import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getEntitlements } from "@/lib/entitlements";
import type { Profile, Subscription } from "@/types/database";
import { BillingManageClient } from "@/components/billing-manage-client";

export const metadata: Metadata = { title: "Secure billing" };

export default async function BillingManagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/login");

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .maybeSingle();

  const entitlements = getEntitlements(
    profile as Profile,
    subscription as Subscription | null
  );

  const p = profile as Profile;
  const showTrialChoice =
    !entitlements.isComplimentaryPro &&
    !entitlements.hasActiveSubscription &&
    p.tier === "free" &&
    !p.pro_trial_started_at;

  const showCheckoutOnly =
    !entitlements.isComplimentaryPro &&
    !entitlements.hasActiveSubscription &&
    !showTrialChoice;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">Secure billing</h1>
      <p className="mt-2 text-sm text-muted">
        Manage your Pro trial or subscription. This area is unlocked after email verification.
      </p>

      <div className="mt-8">
        <BillingManageClient
          isComplimentaryPro={entitlements.isComplimentaryPro}
          hasActiveSubscription={entitlements.hasActiveSubscription}
          showTrialChoice={showTrialChoice}
          showCheckoutOnly={showCheckoutOnly}
        />
      </div>
    </div>
  );
}
