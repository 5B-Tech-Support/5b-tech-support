import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { hasValidBillingGrant } from "@/lib/billing-gate";
import { getEntitlements } from "@/lib/entitlements";
import type { Profile, Subscription } from "@/types/database";

export default async function BillingManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    redirect("/login");
  }

  if (!userId) redirect("/login");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!profile) redirect("/login");

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .maybeSingle();

  const entitlements = getEntitlements(
    profile as Profile,
    subscription as Subscription | null
  );

  if (entitlements.isComplimentaryPro || entitlements.hasActiveSubscription) {
    return <>{children}</>;
  }

  const gated = await hasValidBillingGrant(userId);
  if (!gated) {
    redirect("/billing/verify");
  }

  return <>{children}</>;
}
