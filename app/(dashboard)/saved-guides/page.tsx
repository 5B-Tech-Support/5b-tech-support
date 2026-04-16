import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Saved Guides" };

export default function SavedGuidesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">Saved Guides</h1>

      <div className="mt-8 rounded-xl border border-border p-12 text-center">
        <p className="font-medium">You haven&apos;t saved any guides yet.</p>
        <p className="mt-2 text-sm text-muted">
          Browse the Help Center to find helpful content.
        </p>
        <Link href="/help-center" className="btn-primary mt-6 inline-flex">
          Go to Help Center
        </Link>
      </div>
    </div>
  );
}
