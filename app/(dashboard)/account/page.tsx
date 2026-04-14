import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getEntitlements } from "@/lib/entitlements";
import type { Profile, Subscription } from "@/types/database";
import { AccountActions } from "./account-actions";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">Your Account</h1>

      <div className="mt-8 rounded-xl border border-border p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Email</dt>
            <dd className="font-medium">{profile.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Name</dt>
            <dd className="font-medium">{profile.full_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Plan</dt>
            <dd className="font-medium capitalize">
              {entitlements.tier}
              {entitlements.isTrialActive && (
                <span className="ml-2 text-xs text-primary">(trial active)</span>
              )}
              {entitlements.isTrialExpired && (
                <span className="ml-2 text-xs text-danger">(trial expired)</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Support response</dt>
            <dd className="font-medium">
              {entitlements.supportResponseDays} business day
              {entitlements.supportResponseDays !== 1 ? "s" : ""}
            </dd>
          </div>
        </dl>
      </div>

      <AccountActions
        hasSubscription={entitlements.hasActiveSubscription}
        tier={entitlements.tier}
      />

      {/* Saved guides placeholder */}
      <div className="mt-10 rounded-xl border border-border p-6 text-center text-sm text-muted">
        <p className="font-medium text-foreground">Saved Guides</p>
        <p className="mt-1">
          Your saved guides will appear here once the guide library is live.
        </p>
      </div>
    </div>
  );
}
