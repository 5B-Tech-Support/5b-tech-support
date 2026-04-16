import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/billing"
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        &larr; Back to Billing
      </Link>

      <h1 className="mt-6 text-2xl font-bold">Refund Policy</h1>

      <p className="mt-6 text-sm leading-relaxed text-muted">
        5B Tech Support does not offer refunds. You can try Pro free for one
        month before subscribing, and you can cancel your subscription at any
        time. After canceling, your Pro access continues until the end of your
        current billing period.
      </p>

      <Link href="/billing" className="btn-secondary mt-8 inline-flex">
        Back to Billing
      </Link>
    </div>
  );
}
