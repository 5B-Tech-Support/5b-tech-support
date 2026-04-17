"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Guide } from "@/types/database";
import { GuideCard } from "@/components/help-center/guide-card";
import {
  GuideFilters,
  GuideSearchBar,
  type FilterState,
} from "@/components/help-center/guide-filters";
import { ViewToggle } from "@/components/help-center/view-toggle";

function getInitialView(): "list" | "grid" {
  if (typeof window === "undefined") return "list";
  return (localStorage.getItem("hc-view") as "list" | "grid") ?? "list";
}

function Windows11Content() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<"list" | "grid">(getInitialView);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch,
    category: null,
    difficulty: null,
    tier: null,
  });

  const fetchGuides = useCallback(async (f: FilterState) => {
    setLoading(true);
    const params = new URLSearchParams({ os: "windows11", limit: "50" });
    if (f.search) params.set("search", f.search);
    if (f.category) params.set("category", f.category);
    if (f.difficulty) params.set("difficulty", f.difficulty);
    if (f.tier) params.set("tier", f.tier);

    try {
      const res = await fetch(`/api/guides?${params}`);
      const data = await res.json();
      setGuides(data.guides ?? []);
      setTotal(data.pagination?.total ?? 0);
    } catch {
      setGuides([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGuides(filters);
  }, [filters, fetchGuides]);

  function handleViewChange(v: "list" | "grid") {
    setView(v);
    localStorage.setItem("hc-view", v);
  }

  const guideList = loading ? (
    <div
      className={
        view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "space-y-3"
      }
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse glass rounded-2xl ${view === "grid" ? "h-56" : "h-28"}`}
        />
      ))}
    </div>
  ) : guides.length === 0 ? (
    <div className="glass-strong rounded-2xl p-10 text-center sm:p-12">
      <p className="font-medium text-foreground">No guides match your filters.</p>
      <p className="mt-2 text-sm text-muted">Try broadening your search or clearing filters.</p>
      <button
        type="button"
        onClick={() =>
          setFilters({ search: "", category: null, difficulty: null, tier: null })
        }
        className="btn-secondary mt-5"
      >
        Clear all filters
      </button>
    </div>
  ) : (
    <div
      className={
        view === "grid"
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
          : "space-y-3"
      }
    >
      {guides.map((guide) => (
        <GuideCard key={guide.id} guide={guide} variant={view} />
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-8">
      <div
        className="grid grid-cols-1 gap-4 sm:gap-5
          lg:grid-cols-[minmax(0,15.5rem)_minmax(0,1fr)] lg:gap-x-8 lg:gap-y-5 lg:items-start"
      >
        {/* Left: back link + title sit directly above the filter card (desktop) */}
        <header className="space-y-2 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:self-start lg:space-y-2.5">
          <Link
            href="/help-center"
            className="inline-flex text-sm text-muted transition-colors hover:text-primary"
          >
            &larr; Help Center
          </Link>
          <div className="flex items-start justify-between gap-3 lg:block lg:max-w-none">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Windows 11 Guides
            </h1>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((o) => !o)}
              className="glass shrink-0 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground lg:hidden"
            >
              {mobileFiltersOpen ? "Close" : "Filters"}
            </button>
          </div>
        </header>

        <div className="flex min-w-0 flex-col gap-4 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <GuideSearchBar
            search={filters.search}
            onSearchChange={(search) => setFilters((prev) => ({ ...prev, search }))}
          />
          <div className="flex min-w-0 items-center justify-between gap-3">
            <p className="text-sm text-muted tabular-nums">
              {loading ? "Loading..." : `${total} guide${total !== 1 ? "s" : ""} found`}
            </p>
            <ViewToggle view={view} onChange={handleViewChange} />
          </div>
        </div>

        <aside
          className={`min-w-0 transition-[opacity,transform] duration-200 lg:col-start-1 lg:row-start-3 ${
            mobileFiltersOpen
              ? "fixed inset-0 z-50 flex flex-col overflow-auto bg-background/95 p-5 backdrop-blur-md lg:static lg:z-auto lg:flex-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
              : "hidden lg:block"
          }`}
        >
          {mobileFiltersOpen && (
            <div className="mb-4 flex shrink-0 items-center justify-between border-b border-border pb-3 lg:hidden">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg px-2 py-1 text-muted hover:bg-surface/80 hover:text-foreground"
                aria-label="Close filters"
              >
                &times;
              </button>
            </div>
          )}
          <div
            className={`glass-strong rounded-2xl p-4 sm:p-5 lg:sticky lg:top-20 ${
              mobileFiltersOpen ? "mt-0 flex-1" : ""
            }`}
          >
            <GuideFilters
              showSearch={false}
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setMobileFiltersOpen(false);
              }}
            />
          </div>
        </aside>

        <div className="min-w-0 lg:col-start-2 lg:row-start-3">{guideList}</div>
      </div>
    </div>
  );
}

export default function Windows11Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="h-4 w-36 animate-pulse rounded bg-surface/80" />
          <div className="mt-4 h-8 w-56 animate-pulse rounded bg-surface/80" />
          <div className="mt-6 h-11 w-full max-w-xl animate-pulse rounded-xl bg-surface/80" />
        </div>
      }
    >
      <Windows11Content />
    </Suspense>
  );
}
