"use client";

import Link from "next/link";
import type { Guide } from "@/types/database";

const categoryIcons: Record<string, string> = {
  Performance: "\u26a1",
  Security: "\ud83d\udee1\ufe0f",
  Printer: "\ud83d\udda8\ufe0f",
  Internet: "\ud83c\udf10",
  Email: "\u2709\ufe0f",
  Storage: "\ud83d\udcc1",
  Bluetooth: "\ud83d\udd35",
  Apps: "\ud83d\udce6",
  Browser: "\ud83e\udded",
  Settings: "\u2699\ufe0f",
};

const difficultyColors: Record<string, string> = {
  beginner: "bg-success/10 text-success",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-danger/10 text-danger",
};

interface GuideCardProps {
  guide: Guide;
  variant: "list" | "grid";
}

export function GuideCard({ guide, variant }: GuideCardProps) {
  const icon = categoryIcons[guide.category] ?? "\ud83d\udcd6";

  if (variant === "grid") {
    return (
      <Link
        href={`/guide/${guide.slug}`}
        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
      >
        <div className="flex h-32 items-center justify-center bg-surface text-4xl">
          {guide.thumbnail_url ? (
            <img
              src={guide.thumbnail_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{icon}</span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {guide.title}
          </h3>
          <p className="mt-1.5 text-xs text-muted line-clamp-2">
            {guide.description}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
            <span className="text-xs text-muted">
              {guide.estimated_minutes} min
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColors[guide.difficulty] ?? ""}`}>
              {guide.difficulty}
            </span>
            {guide.tier_required === "pro" && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Pro
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/guide/${guide.slug}`}
      className="group flex gap-4 overflow-hidden rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-lg bg-surface text-3xl sm:h-28 sm:w-40">
        {guide.thumbnail_url ? (
          <img
            src={guide.thumbnail_url}
            alt=""
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <span>{icon}</span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">
            {guide.title}
          </h3>
          <p className="mt-1 text-sm text-muted line-clamp-2">
            {guide.description}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
            {guide.category}
          </span>
          <span className="text-xs text-muted">
            {guide.estimated_minutes} min
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColors[guide.difficulty] ?? ""}`}>
            {guide.difficulty}
          </span>
          {guide.tier_required === "pro" && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Pro
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
