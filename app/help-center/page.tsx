"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Guide } from "@/types/database";

export default function HelpCenterPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [popular, setPopular] = useState<Guide[]>([]);

  useEffect(() => {
    fetch("/api/guides?limit=6&os=windows11")
      .then((r) => r.json())
      .then((data) => setPopular(data.guides ?? []))
      .catch(() => {});
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/help-center/windows11?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold">Help Center</h1>
        <p className="mt-2 text-muted">
          Choose your operating system to find guides.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mt-4 animate-fade-up stagger-1">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="7" cy="7" r="5" />
            <line x1="11" y1="11" x2="14" y2="14" />
          </svg>
          <input
            type="search"
            placeholder="Search all guides"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface/50 backdrop-blur-sm py-3 pl-10 pr-4 text-sm placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
          />
        </div>
      </form>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 animate-fade-up stagger-2">
        <Link
          href="/help-center/windows11"
          className="glass-strong rounded-2xl p-8 text-center card-hover"
        >
          <div className="text-4xl animate-float">{"\ud83e\ude9f"}</div>
          <h2 className="mt-4 text-lg font-semibold">Windows 11</h2>
          <p className="mt-1 text-sm text-muted">
            Browse guides for Windows 11
          </p>
        </Link>

        <div className="glass rounded-2xl p-8 text-center opacity-60">
          <div className="text-4xl">{"\ud83c\udf4e"}</div>
          <h2 className="mt-4 text-lg font-semibold">macOS</h2>
          <span className="mt-2 inline-block rounded-full bg-muted/20 px-3 py-1 text-xs font-medium text-muted">
            Coming Soon
          </span>
        </div>
      </div>

      {popular.length > 0 && (
        <div className="mt-12 animate-fade-up stagger-3">
          <h2 className="font-semibold">Popular Guides</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                className="glass rounded-xl p-4 card-hover"
              >
                <h3 className="text-sm font-semibold leading-snug">
                  {guide.title}
                </h3>
                <p className="mt-1 text-xs text-muted line-clamp-2">
                  {guide.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted">
                    {guide.estimated_minutes} min
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
                    {guide.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
