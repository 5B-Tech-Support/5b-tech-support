import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Help Center" };

export default function HelpCenterPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">Help Center</h1>
      <p className="mt-2 text-muted">
        Choose your operating system to find guides.
      </p>

      <div className="mt-4 rounded-xl border border-border bg-background">
        <input
          type="search"
          placeholder="Search guides\u2026"
          disabled
          className="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-sm placeholder:text-muted"
        />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Link
          href="/help-center/windows11"
          className="rounded-xl border border-border p-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="text-4xl">🪟</div>
          <h2 className="mt-4 text-lg font-semibold">Windows 11</h2>
          <p className="mt-1 text-sm text-muted">
            Browse guides for Windows 11
          </p>
        </Link>

        <div className="rounded-xl border border-border bg-surface p-8 text-center opacity-60">
          <div className="text-4xl">🍎</div>
          <h2 className="mt-4 text-lg font-semibold">macOS</h2>
          <span className="mt-2 inline-block rounded-full bg-muted/20 px-3 py-1 text-xs font-medium text-muted">
            Coming Soon
          </span>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-semibold">Popular Guides</h2>
        <p className="mt-2 text-sm text-muted">
          Featured guides will appear here once the content library is live.
        </p>
      </div>
    </div>
  );
}
