import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Guide" };

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/help-center"
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        &larr; Help Center
      </Link>

      <div className="mt-8 rounded-xl border border-border p-12 text-center">
        <div className="text-4xl">🚧</div>
        <h1 className="mt-4 text-lg font-semibold">Coming Soon</h1>
        <p className="mt-2 text-sm text-muted">
          This guide is being written and will be available soon.
        </p>
        <Link href="/help-center" className="btn-primary mt-6 inline-flex">
          Back to Help Center
        </Link>
      </div>

      <p className="disclaimer mt-8 text-center">
        This guide is for educational purposes only. Follow these steps at your
        own risk. 5B Tech Support is not responsible for any outcomes.
      </p>
    </div>
  );
}
