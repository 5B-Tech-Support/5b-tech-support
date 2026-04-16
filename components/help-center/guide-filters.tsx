"use client";

import { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  "Performance",
  "Security",
  "Printer",
  "Internet",
  "Email",
  "Storage",
  "Bluetooth",
  "Apps",
  "Browser",
  "Settings",
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const TIERS = ["free", "pro"];

export interface FilterState {
  search: string;
  category: string | null;
  difficulty: string | null;
  tier: string | null;
}

interface GuideFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function GuideFilters({ filters, onChange }: GuideFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ ...filters, search: value });
    }, 300);
  }

  const hasActiveFilters =
    filters.search || filters.category || filters.difficulty || filters.tier;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
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
            placeholder="Search guides\u2026"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface/50 backdrop-blur-sm py-2.5 pl-10 pr-4 text-sm placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Category
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            onClick={() => onChange({ ...filters, category: null })}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
              !filters.category
                ? "text-white"
                : "border border-border text-muted hover:border-primary/40 hover:text-foreground"
            }`}
            style={!filters.category ? { background: "var(--accent-gradient)" } : undefined}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                onChange({
                  ...filters,
                  category: filters.category === cat ? null : cat,
                })
              }
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                filters.category === cat
                  ? "text-white"
                  : "border border-border text-muted hover:border-primary/40 hover:text-foreground"
              }`}
              style={filters.category === cat ? { background: "var(--accent-gradient)" } : undefined}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Difficulty
        </h3>
        <div className="mt-2 space-y-1.5">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() =>
                onChange({
                  ...filters,
                  difficulty: filters.difficulty === d ? null : d,
                })
              }
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                filters.difficulty === d
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted hover:bg-surface/80 hover:text-foreground"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  d === "beginner"
                    ? "bg-success"
                    : d === "intermediate"
                      ? "bg-yellow-500"
                      : "bg-danger"
                }`}
              />
              <span className="capitalize">{d}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tier */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Access
        </h3>
        <div className="mt-2 space-y-1.5">
          {TIERS.map((t) => (
            <button
              key={t}
              onClick={() =>
                onChange({
                  ...filters,
                  tier: filters.tier === t ? null : t,
                })
              }
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                filters.tier === t
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted hover:bg-surface/80 hover:text-foreground"
              }`}
            >
              <span className="capitalize">{t === "pro" ? "Pro only" : "Free"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={() =>
            onChange({ search: "", category: null, difficulty: null, tier: null })
          }
          className="glass w-full rounded-lg px-3 py-2 text-xs font-medium text-muted transition-all duration-200 hover:border-primary/40 hover:text-foreground"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
