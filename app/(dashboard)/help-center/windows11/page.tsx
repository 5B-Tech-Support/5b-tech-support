import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Windows 11 Guides" };

const filterCategories = [
  "All",
  "Performance",
  "Internet",
  "Security",
  "Email",
  "Apps",
  "Settings",
  "Bluetooth",
  "Printer",
  "Storage",
];

export default function Windows11Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/help-center"
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        &larr; Help Center
      </Link>

      <h1 className="mt-4 text-2xl font-bold">Windows 11 Guides</h1>

      <div className="mt-4 rounded-xl border border-border bg-background">
        <input
          type="search"
          placeholder="Search Windows 11 guides\u2026"
          disabled
          className="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-sm placeholder:text-muted"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filterCategories.map((cat) => (
          <button
            key={cat}
            disabled
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-primary/40"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-border p-12 text-center">
        <div className="text-4xl">🚧</div>
        <h2 className="mt-4 text-lg font-semibold">Coming Soon</h2>
        <p className="mt-2 text-sm text-muted">
          Windows 11 guides are being written and will be available soon.
          Check back shortly!
        </p>
      </div>
    </div>
  );
}
