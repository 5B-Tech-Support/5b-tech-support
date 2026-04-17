"use client";

import Link from "next/link";
import { useState } from "react";

async function postBillingUrl(path: string): Promise<void> {
  const res = await fetch(path, { method: "POST", credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  if (data.url) window.location.href = data.url as string;
}

export function BillingOverviewClient({
  isComplimentaryPro,
  hasActiveSubscription,
  isTrialActive,
}: {
  isComplimentaryPro: boolean;
  hasActiveSubscription: boolean;
  isTrialActive: boolean;
}) {
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function portal() {
    setErr(null);
    setLoading(true);
    try {
      await postBillingUrl("/api/billing/create-portal-session");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (isComplimentaryPro) {
    return null;
  }

  if (hasActiveSubscription) {
    return (
      <div className="mt-4">
        {err && <p className="mb-2 text-sm text-danger">{err}</p>}
        <button
          type="button"
          onClick={() => void portal()}
          disabled={loading}
          className="btn-primary inline-flex"
        >
          {loading ? "Opening..." : "Manage Subscription"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {isTrialActive && (
        <p className="text-sm text-muted">
          You are on a Pro trial. To subscribe with a card, continue to secure billing first.
        </p>
      )}
      <Link href="/billing/verify" className="btn-primary inline-flex">
        Continue to secure billing
      </Link>
    </div>
  );
}
