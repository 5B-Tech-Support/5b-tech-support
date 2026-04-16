import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getEntitlements } from "@/lib/entitlements";
import type { Profile, Subscription } from "@/types/database";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
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
      <h1 className="text-2xl font-bold">Billing</h1>

      <div className="mt-8 rounded-xl border border-border p-6">
        <h2 className="font-semibold">Current Plan</h2>

        {entitlements.isTrialActive && profile.trial_expires_at ? (
          <div className="mt-3">
            <p className="text-sm">
              <span className="font-medium">Pro Trial</span> &mdash; ends{" "}
              {new Date(profile.trial_expires_at).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <Link href="/api/billing/create-checkout" className="btn-primary mt-4 inline-flex">
              Subscribe to Pro
            </Link>
          </div>
        ) : entitlements.hasActiveSubscription ? (
          <div className="mt-3">
            <p className="text-sm">
              <span className="font-medium">Pro</span> &mdash; active subscription
            </p>
            {(subscription as Subscription)?.current_period_end && (
              <p className="mt-1 text-xs text-muted">
                Next billing date:{" "}
                {new Date((subscription as Subscription).current_period_end!).toLocaleDateString()}
              </p>
            )}
            <div className="mt-4 flex gap-3">
              <Link href="/api/billing/portal" className="btn-primary inline-flex">
                Manage Subscription
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm">
              <span className="font-medium">Free Plan</span>
            </p>
            <Link href="/register/pro-trial" className="btn-primary mt-4 inline-flex">
              Upgrade to Pro
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border p-6">
        <h2 className="font-semibold">Billing History</h2>
        <p className="mt-2 text-sm text-muted">
          Past invoices will appear here once billing is active.
        </p>
      </div>

      <p className="mt-6 text-sm text-muted">
        <Link href="/billing/refund" className="text-primary hover:underline">
          View refund policy
        </Link>
      </p>
    </div>
  );
}
