"use client";

import Link from "next/link";
import { useState } from "react";

async function postJson(path: string): Promise<void> {
  const res = await fetch(path, { method: "POST", credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  if (data.url) window.location.href = data.url as string;
}

export function BillingManageClient({
  isComplimentaryPro,
  hasActiveSubscription,
  showTrialChoice,
  showCheckoutOnly,
}: {
  isComplimentaryPro: boolean;
  hasActiveSubscription: boolean;
  showTrialChoice: boolean;
  showCheckoutOnly: boolean;
}) {
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout() {
    setErr(null);
    setLoading("checkout");
    try {
      await postJson("/api/billing/create-checkout");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function startTrial() {
    setErr(null);
    setLoading("trial");
    try {
      const res = await fetch("/api/billing/start-trial", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      window.location.href = "/billing";
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function portal() {
    setErr(null);
    setLoading("portal");
    try {
      await postJson("/api/billing/create-portal-session");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  if (isComplimentaryPro) {
    return (
      <p className="text-sm text-muted">
        Your account includes complimentary Pro access. No payment or trial setup is required.
      </p>
    );
  }

  if (hasActiveSubscription) {
    return (
      <div className="space-y-3">
        {err && <p className="text-sm text-danger">{err}</p>}
        <button
          type="button"
          onClick={() => void portal()}
          disabled={loading !== null}
          className="btn-primary"
        >
          {loading === "portal" ? "Opening\u2026" : "Manage subscription in Stripe"}
        </button>
        <p className="text-xs text-muted">
          Update your card, view invoices, or cancel from the secure billing portal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {err && <p className="text-sm text-danger">{err}</p>}

      {showTrialChoice && (
        <div className="glass rounded-xl p-5">
          <h3 className="font-semibold">Pro free trial</h3>
          <p className="mt-2 text-sm text-muted">
            You can start a 1-month Pro trial (no card required) or subscribe with a card now.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void startTrial()}
              disabled={loading !== null}
              className="btn-primary"
            >
              {loading === "trial" ? "Starting\u2026" : "Activate 1-month free trial"}
            </button>
            <button
              type="button"
              onClick={() => void checkout()}
              disabled={loading !== null}
              className="btn-secondary"
            >
              {loading === "checkout" ? "Redirecting\u2026" : "Subscribe with card"}
            </button>
          </div>
        </div>
      )}

      {showCheckoutOnly && (
        <div className="glass rounded-xl p-5">
          <h3 className="font-semibold">Subscribe to Pro</h3>
          <p className="mt-2 text-sm text-muted">
            Continue to secure checkout to add your payment method and unlock Pro.
          </p>
          <button
            type="button"
            onClick={() => void checkout()}
            disabled={loading !== null}
            className="btn-primary mt-4"
          >
            {loading === "checkout" ? "Redirecting\u2026" : "Add card and subscribe"}
          </button>
        </div>
      )}

      <Link href="/billing" className="text-sm text-primary hover:underline">
        &larr; Back to billing overview
      </Link>
    </div>
  );
}
