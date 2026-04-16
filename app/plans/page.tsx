import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Plans" };

export default function PlansPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Pricing
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Simple plans. No surprises.
        </h1>
        <p className="mt-3 text-muted">
          Choose Free or Pro. No pushy upsells. No hidden fees. No ads on any
          plan.
        </p>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
        {/* Free */}
        <div className="rounded-xl border border-border p-8">
          <h2 className="text-xl font-semibold">Free</h2>
          <div className="mt-3">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-muted">/month</span>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">&#10003;</span>
              Limited tutorial library
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">&#10003;</span>
              Email support with 3 business day response
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">&#10003;</span>
              Save guides to your account
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">&#10003;</span>
              No ads, ever
            </li>
          </ul>
          <Link
            href="/register"
            className="btn-secondary mt-8 w-full"
          >
            Create Free Account
          </Link>
        </div>

        {/* Pro */}
        <div className="rounded-xl border-2 border-primary/50 p-8">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Pro</h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Free trial
            </span>
          </div>
          <div className="mt-3">
            <span className="text-4xl font-bold">$3.99</span>
            <span className="text-muted">/month</span>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">&#10003;</span>
              Full Windows tutorial library
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">&#10003;</span>
              Email support with 48-hour response (business days)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">&#10003;</span>
              Save guides to your account
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">&#10003;</span>
              No ads, ever
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">&#10003;</span>
              1-month free trial &mdash; no credit card needed
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted">
            Your trial does not auto-charge. When it ends, you simply choose
            whether to subscribe.
          </p>
          <Link
            href="/register/pro-trial"
            className="btn-primary mt-6 w-full"
          >
            Start Free Trial
          </Link>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Plan features may change over time. We&apos;ll always notify you of any
        changes before they take effect.
      </p>

      <p className="disclaimer mt-12 text-center">
        Response times are goals, not guarantees. Plan features may change with
        notice. See{" "}
        <Link href="/terms" className="underline">
          Terms of Service
        </Link>
        .
      </p>
    </div>
  );
}
