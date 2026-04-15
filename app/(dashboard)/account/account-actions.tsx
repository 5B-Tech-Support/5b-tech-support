"use client";

import { useState } from "react";
import Link from "next/link";

export function AccountActions({
  hasSubscription,
  tier,
}: {
  hasSubscription: boolean;
  tier: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleBillingAction(endpoint: string, label: string) {
    setLoading(label);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {hasSubscription ? (
        <button
          onClick={() =>
            handleBillingAction(
              "/api/billing/create-portal-session",
              "manage"
            )
          }
          disabled={loading === "manage"}
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface transition-colors disabled:opacity-50"
        >
          {loading === "manage" ? "Loading..." : "Manage subscription"}
        </button>
      ) : (
        tier === "free" && (
          <button
            onClick={() =>
              handleBillingAction("/api/billing/create-checkout", "upgrade")
            }
            disabled={loading === "upgrade"}
            className="rounded-xl gradient-button px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading === "upgrade" ? "Loading..." : "Upgrade to Pro — $3.99/mo"}
          </button>
        )
      )}

      <form action="/api/auth/signout" method="POST">
        <button
          type="submit"
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-danger hover:bg-surface transition-colors"
        >
          Sign out
        </button>
      </form>

      <Link
        href="/support/tickets"
        className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface transition-colors"
      >
        My support tickets
      </Link>
    </div>
  );
}
