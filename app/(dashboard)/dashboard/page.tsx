import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getEntitlements } from "@/lib/entitlements";
import type { Profile, Subscription } from "@/types/database";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
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

  const firstName = profile.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">Welcome back, {firstName}!</h1>

      {entitlements.isTrialActive && profile.trial_expires_at && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          Your free Pro trial ends on{" "}
          <strong>
            {new Date(profile.trial_expires_at).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </strong>
          .{" "}
          <Link href="/billing" className="text-primary hover:underline font-medium">
            Subscribe to Pro
          </Link>{" "}
          to keep full access.
        </div>
      )}

      {entitlements.isTrialExpired && (
        <div className="mt-4 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm">
          Your Pro trial has ended.{" "}
          <Link href="/billing" className="text-primary hover:underline font-medium">
            Subscribe to Pro
          </Link>{" "}
          to get it back, or continue with the Free plan.
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/help-center"
          className="rounded-xl border border-border p-6 transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <h2 className="font-semibold">Help Center</h2>
          <p className="mt-1 text-sm text-muted">Browse guides and tutorials</p>
        </Link>
        <Link
          href="/support/tickets"
          className="rounded-xl border border-border p-6 transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <h2 className="font-semibold">Support Tickets</h2>
          <p className="mt-1 text-sm text-muted">View or create support requests</p>
        </Link>
        <Link
          href="/saved-guides"
          className="rounded-xl border border-border p-6 transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <h2 className="font-semibold">Saved Guides</h2>
          <p className="mt-1 text-sm text-muted">Your bookmarked tutorials</p>
        </Link>
        <Link
          href="/billing"
          className="rounded-xl border border-border p-6 transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <h2 className="font-semibold">Billing</h2>
          <p className="mt-1 text-sm text-muted">Manage your subscription</p>
        </Link>
      </div>

      <div className="mt-10 rounded-xl border border-border p-6">
        <h2 className="font-semibold">Current Plan</h2>
        <p className="mt-1 text-sm text-muted">
          You are on the{" "}
          <span className="font-medium text-foreground capitalize">
            {entitlements.tier}
          </span>{" "}
          plan.{" "}
          <Link href="/billing" className="text-primary hover:underline">
            Manage billing &rarr;
          </Link>
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-border p-6">
        <h2 className="font-semibold">Recent Activity</h2>
        <p className="mt-1 text-sm text-muted">
          Your recently viewed guides and open tickets will appear here.
        </p>
      </div>
    </div>
  );
}
