"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
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
  const [sidebarTopOffset, setSidebarTopOffset] = useState(0);
  const mainTopRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const el = mainTopRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      setSidebarTopOffset(el.offsetHeight);
    });
    ro.observe(el);
    setSidebarTopOffset(el.offsetHeight);

    return () => ro.disconnect();
  }, [filters.search, loading, guides.length, view]);

  function handleViewChange(v: "list" | "grid") {
    setView(v);
    localStorage.setItem("hc-view", v);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/help-center"
        className="text-sm text-muted hover:text-primary transition-colors duration-200"
      >
        &larr; Help Center
      </Link>

      <div className="mt-4 flex items-center justify-between animate-fade-up">
        <h1 className="text-2xl font-bold">Windows 11 Guides</h1>
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="glass rounded-lg px-3 py-2 text-sm text-muted lg:hidden"
        >
          Filters
        </button>
      </div>

      <div className="mt-6 flex gap-8 items-start">
        {/* Sidebar — desktop: offset so filter card aligns with first guide row */}
        <aside
          className={`shrink-0 transition-all duration-300 ${
            mobileFiltersOpen
              ? "fixed inset-0 z-50 overflow-auto bg-background p-6 lg:static lg:z-auto lg:bg-transparent lg:p-0"
              : "hidden lg:block"
          } lg:w-64`}
        >
          {mobileFiltersOpen && (
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <h2 className="font-semibold">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-muted hover:text-foreground"
              >
                &times;
              </button>
            </div>
          )}
          <div
            className="glass-strong rounded-2xl p-4 lg:transition-[margin] lg:duration-200"
            style={
              mobileFiltersOpen
                ? undefined
                : { marginTop: sidebarTopOffset > 0 ? `${sidebarTopOffset}px` : undefined }
            }
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

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div ref={mainTopRef}>
            <GuideSearchBar
              search={filters.search}
              onSearchChange={(search) => setFilters((prev) => ({ ...prev, search }))}
            />
            <div className="mt-4 mb-4 flex items-center justify-between">
              <p className="text-sm text-muted">
                {loading ? "Loading\u2026" : `${total} guide${total !== 1 ? "s" : ""} found`}
              </p>
              <ViewToggle view={view} onChange={handleViewChange} />
            </div>
          </div>

          {loading ? (
            <div className={`${view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`animate-pulse glass rounded-xl ${
                    view === "grid" ? "h-56" : "h-28"
                  }`}
                />
              ))}
            </div>
          ) : guides.length === 0 ? (
            <div className="glass-strong rounded-2xl p-12 text-center">
              <p className="font-medium">No guides match your filters.</p>
              <p className="mt-2 text-sm text-muted">
                Try broadening your search or clearing filters.
              </p>
              <button
                onClick={() =>
                  setFilters({ search: "", category: null, difficulty: null, tier: null })
                }
                className="btn-secondary mt-4"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div
              className={`transition-all duration-300 ${
                view === "grid"
                  ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  : "space-y-3"
              }`}
            >
              {guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} variant={view} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Windows11Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8"><div className="h-8 w-48 animate-pulse rounded bg-surface" /></div>}>
      <Windows11Content />
    </Suspense>
  );
}
