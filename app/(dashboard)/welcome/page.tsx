import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getEntitlements } from "@/lib/entitlements";
import type { Profile, Subscription } from "@/types/database";

export const metadata: Metadata = { title: "Welcome" };

export default async function WelcomePage() {
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
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Welcome to 5B Tech Support!</h1>
      <p className="mt-4 text-muted">
        Your account is ready. Here&apos;s how to get started.
      </p>

      <div className="mt-12 space-y-8 text-left">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            1
          </div>
          <div>
            <h2 className="font-semibold">Browse the Help Center</h2>
            <p className="mt-1 text-sm text-muted">
              Find step-by-step guides for common Windows problems.
            </p>
            <Link href="/help-center" className="mt-2 inline-block text-sm text-primary hover:underline">
              Go to Help Center &rarr;
            </Link>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            2
          </div>
          <div>
            <h2 className="font-semibold">Save guides you find helpful</h2>
            <p className="mt-1 text-sm text-muted">
              Bookmark any guide so you can come back to it later.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            3
          </div>
          <div>
            <h2 className="font-semibold">Need more help? Submit a support ticket</h2>
            <p className="mt-1 text-sm text-muted">
              If a guide doesn&apos;t solve your issue, our team is here for you.
            </p>
            <Link href="/support/tickets/new" className="mt-2 inline-block text-sm text-primary hover:underline">
              Create a ticket &rarr;
            </Link>
          </div>
        </div>
      </div>

      {entitlements.isTrialActive && (
        <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          You have 30 days of full Pro access. Explore everything!
        </div>
      )}

      <Link href="/dashboard" className="btn-primary mt-10 inline-flex px-8 py-3.5 text-base">
        Go to Dashboard
      </Link>
    </div>
  );
}
