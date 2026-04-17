import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getEntitlements } from "@/lib/entitlements";
import type { Profile, Subscription } from "@/types/database";

export const metadata: Metadata = { title: "Dashboard" };

const QUICK_LINKS: {
  href: string;
  title: string;
  hint: string;
  emoji: string;
}[] = [
  { href: "/help-center", title: "Help Center", hint: "Guides & tutorials", emoji: "\ud83d\udcda" },
  { href: "/support/tickets", title: "Support", hint: "Tickets & requests", emoji: "\ud83d\udcac" },
  { href: "/saved-guides", title: "Saved", hint: "Bookmarked guides", emoji: "\u2b50" },
  { href: "/billing", title: "Billing", hint: "Plan & payments", emoji: "\ud83d\udcb3" },
  { href: "/settings", title: "Settings", hint: "Account & prefs", emoji: "\u2699\ufe0f" },
  { href: "/faq", title: "FAQ", hint: "Common answers", emoji: "\u2753" },
];

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

  const planLabel = entitlements.isComplimentaryPro
    ? "Complimentary Pro"
    : entitlements.hasActiveSubscription
      ? "Pro (subscribed)"
      : entitlements.isTrialActive
        ? "Pro trial"
        : entitlements.tier === "pro"
          ? "Pro"
          : "Free";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      {/* Welcome */}
      <section
        className="glass-strong relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{ boxShadow: "var(--glow-md)" }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.25), transparent 70%)",
          }}
        />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Your workspace</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
              Jump into guides, tickets, and billing from the grid below. Everything you need is one tap away.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
            <span
              className="inline-flex items-center rounded-xl border border-border bg-surface/60 px-4 py-2 text-sm font-semibold capitalize text-foreground backdrop-blur-sm"
              style={{ boxShadow: "var(--glow-sm)" }}
            >
              {planLabel}
            </span>
            {entitlements.tier === "pro" && (
              <span className="text-xs font-medium text-muted">
                {entitlements.supportResponseDays}-day response window
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Trial / expiry notices */}
      {entitlements.isTrialActive && profile.trial_expires_at && (
        <div className="mt-5 rounded-2xl border border-primary/35 bg-primary/5 p-4 text-sm md:p-5">
          <p className="font-medium text-foreground">Pro trial active</p>
          <p className="mt-1 text-muted">
            Your trial ends on{" "}
            <strong className="text-foreground">
              {new Date(profile.trial_expires_at).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
            .{" "}
            <Link href="/billing" className="font-medium text-primary hover:underline">
              Secure billing
            </Link>{" "}
            to keep Pro access.
          </p>
        </div>
      )}

      {entitlements.isTrialExpired && (
        <div className="mt-5 rounded-2xl border border-danger/35 bg-danger/5 p-4 text-sm md:p-5">
          <p className="font-medium text-foreground">Trial ended</p>
          <p className="mt-1 text-muted">
            You are on the Free plan again.{" "}
            <Link href="/billing" className="font-medium text-primary hover:underline">
              Subscribe to Pro
            </Link>{" "}
            anytime to restore full access.
          </p>
        </div>
      )}

      {/* Bento: square-ish tiles */}
      <section className="mt-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Quick links</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group glass-strong card-hover flex aspect-square flex-col items-center justify-center rounded-2xl p-4 text-center transition-transform duration-300 hover:-translate-y-0.5 sm:p-5"
              style={{ boxShadow: "var(--glow-sm)" }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 sm:text-[1.75rem]"
                style={{ background: "var(--card-gradient)" }}
                aria-hidden
              >
                {item.emoji}
              </span>
              <span className="mt-3 text-sm font-semibold text-foreground sm:text-base">{item.title}</span>
              <span className="mt-1 line-clamp-2 text-xs text-muted sm:text-sm">{item.hint}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Wide cards */}
      <section className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
        <div
          className="glass-strong flex min-h-[200px] flex-col justify-between rounded-2xl p-6 md:min-h-[220px]"
          style={{ boxShadow: "var(--glow-sm)" }}
        >
          <div>
            <h2 className="text-lg font-semibold">Plan & access</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              You are on{" "}
              <span className="font-medium text-foreground">{planLabel}</span>
              {entitlements.canAccessAllGuides ? (
                <> with full guide library access and priority support.</>
              ) : (
                <> with access to free guides. Upgrade anytime for every tutorial plus faster support.</>
              )}
            </p>
          </div>
          <Link
            href="/billing"
            className="btn-secondary mt-4 inline-flex w-fit items-center justify-center px-5 py-2.5 text-sm font-semibold"
          >
            Billing & plans
          </Link>
        </div>

        <div
          className="glass-strong flex min-h-[200px] flex-col justify-between rounded-2xl p-6 md:min-h-[220px]"
          style={{ boxShadow: "var(--glow-sm)" }}
        >
          <div>
            <h2 className="text-lg font-semibold">Activity</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Recently opened guides and ticket updates will show up here in a future update. For now, open{" "}
              <Link href="/help-center" className="font-medium text-primary hover:underline">
                Help Center
              </Link>{" "}
              or{" "}
              <Link href="/support/tickets" className="font-medium text-primary hover:underline">
                Support
              </Link>{" "}
              to pick up where you left off.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/help-center/windows11"
              className="rounded-lg border border-border bg-surface/50 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/30 hover:text-foreground"
            >
              Windows 11 guides
            </Link>
            <Link
              href="/support/tickets/new"
              className="rounded-lg border border-border bg-surface/50 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/30 hover:text-foreground"
            >
              New ticket
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
