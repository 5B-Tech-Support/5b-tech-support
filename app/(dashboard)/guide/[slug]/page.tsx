"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Guide } from "@/types/database";

const difficultyColors: Record<string, string> = {
  beginner: "bg-success/10 text-success",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-danger/10 text-danger",
};

function renderMarkdown(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2 class="mt-8 mb-3 text-lg font-semibold">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="mt-6 mb-2 font-semibold">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/\n/g, "<br/>")
    .replace(/^/, '<p class="mt-3">')
    .concat("</p>");
}

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [related, setRelated] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [helpful, setHelpful] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`/api/guides/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setGuide(data.guide ?? null);
        setRelated(data.related ?? []);
      })
      .finally(() => setLoading(false));

    fetch("/api/content/recent-guides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guide_slug: slug }),
    }).catch(() => {});
  }, [slug]);

  async function handleSave() {
    setSaving(true);
    try {
      if (saved) {
        await fetch(`/api/content/saved-guides/${slug}`, { method: "DELETE" });
        setSaved(false);
      } else {
        await fetch("/api/content/saved-guides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guide_slug: slug }),
        });
        setSaved(true);
      }
    } catch {}
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-surface" />
          <div className="h-8 w-3/4 rounded bg-surface" />
          <div className="h-64 rounded-xl bg-surface" />
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-danger">Guide not found.</p>
        <Link href="/help-center" className="mt-2 text-sm text-primary hover:underline">
          Back to Help Center
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/help-center/windows11"
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        &larr; Windows 11 Guides
      </Link>

      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
            {guide.category}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColors[guide.difficulty] ?? ""}`}>
            {guide.difficulty}
          </span>
          <span className="text-xs text-muted">
            {guide.estimated_minutes} min
          </span>
          <span className="text-xs text-muted">Windows 11</span>
          {guide.tier_required === "pro" && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Pro
            </span>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{guide.title}</h1>
        <p className="mt-2 text-muted">{guide.description}</p>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            saved
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {saving ? "Saving\u2026" : saved ? "Saved \u2713" : "Save this guide"}
        </button>
      </div>

      {/* Guide content */}
      <article
        className="prose-custom mt-8 rounded-xl border border-border p-6 text-sm leading-relaxed sm:p-8"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.content) }}
      />

      {/* Helpful prompt */}
      <div className="mt-8 rounded-xl border border-border p-6 text-center">
        <p className="font-medium">Was this guide helpful?</p>
        {helpful === null ? (
          <div className="mt-3 flex justify-center gap-3">
            <button
              onClick={() => setHelpful(true)}
              className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:border-success hover:bg-success/5"
            >
              Yes, it helped
            </button>
            <button
              onClick={() => setHelpful(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:bg-primary/5"
            >
              I still need help
            </button>
          </div>
        ) : helpful ? (
          <p className="mt-2 text-sm text-success">
            Glad to hear it! You can save this guide for future reference.
          </p>
        ) : (
          <div className="mt-2 text-sm text-muted">
            <p>Sorry about that.</p>
            <Link
              href="/support/tickets/new"
              className="mt-1 inline-block text-primary hover:underline"
            >
              Submit a support ticket for personal help &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Related guides */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="font-semibold">Related Guides</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/guide/${r.slug}`}
                className="rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <h3 className="text-sm font-semibold leading-snug">
                  {r.title}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  {r.estimated_minutes} min &middot; {r.difficulty}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="disclaimer mt-10 text-center">
        This guide is for educational purposes only. Follow these steps at your
        own risk. 5B Tech Support is not responsible for any outcomes.
      </p>
    </div>
  );
}
