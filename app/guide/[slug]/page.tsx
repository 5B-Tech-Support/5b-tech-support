"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Guide } from "@/types/database";
import {
  canReadGuide,
  recordGuideRead,
  getRemainingReads,
  getReadLimit,
  type AccessTier,
} from "@/lib/guide-access";

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

function AccessGate({ tier, slug }: { tier: AccessTier; slug: string }) {
  const remaining = getRemainingReads(tier);
  const limit = getReadLimit(tier);

  return (
    <div className="glass-strong rounded-2xl p-8 text-center animate-fade-up" style={{ boxShadow: "var(--glow-lg)" }}>
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
        style={{ background: "var(--accent-gradient)" }}
      >
        🔒
      </div>
      <h2 className="text-xl font-bold">
        {tier === "anon" ? "Create an account to keep reading" : "Upgrade to Pro for unlimited access"}
      </h2>
      <p className="mt-3 text-sm text-muted max-w-md mx-auto">
        {tier === "anon" ? (
          <>
            You&apos;ve used your <strong className="text-foreground">1 free guide</strong> this month.
            Create a free account to read up to 3 guides per month, or go Pro for unlimited access.
          </>
        ) : (
          <>
            You&apos;ve used all <strong className="text-foreground">{limit} guides</strong> this month.
            Upgrade to Pro for unlimited guide access and priority support.
          </>
        )}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {tier === "anon" ? (
          <>
            <Link href="/register" className="btn-primary px-6">
              Create Free Account
            </Link>
            <Link href="/register/pro-trial" className="btn-secondary px-6">
              Start Pro Trial
            </Link>
          </>
        ) : (
          <>
            <Link href="/billing" className="btn-primary px-6">
              Upgrade to Pro
            </Link>
            <Link href="/help-center" className="btn-secondary px-6">
              Browse Guides
            </Link>
          </>
        )}
      </div>
      <p className="disclaimer mt-4">
        {remaining} of {limit} reads remaining this month
      </p>
    </div>
  );
}

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [related, setRelated] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [accessTier, setAccessTier] = useState<AccessTier>("anon");
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          const tier = data.profile?.tier === "pro" ? "pro" : "free";
          setAccessTier(tier as AccessTier);
        } else {
          setAccessTier("anon");
        }
      })
      .catch(() => setAccessTier("anon"));
  }, []);

  useEffect(() => {
    fetch(`/api/guides/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setGuide(data.guide ?? null);
        setRelated(data.related ?? []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!guide || loading) return;
    if (canReadGuide(slug, accessTier)) {
      recordGuideRead(slug);
      setHasAccess(true);
    } else {
      setHasAccess(false);
    }
  }, [guide, loading, slug, accessTier]);

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
          <div className="h-64 rounded-xl glass" />
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
        className="text-sm text-muted hover:text-primary transition-colors duration-200"
      >
        &larr; Windows 11 Guides
      </Link>

      <div className="mt-6 animate-fade-up">
        <div className="flex flex-wrap items-center gap-2">
          <span className="glass rounded-full px-2.5 py-0.5 text-xs text-muted">
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

      {hasAccess && guide.video_url && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-black shadow-lg animate-fade-up stagger-1">
          <video
            src={guide.video_url}
            controls
            playsInline
            className="aspect-video w-full max-h-[min(70vh,560px)] object-contain"
          >
            Your browser does not support embedded video.
          </video>
        </div>
      )}

      {accessTier !== "anon" && (
        <div className="mt-4 flex gap-3 animate-fade-up stagger-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`glass rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
              saved
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted hover:text-foreground hover:border-primary/40"
            }`}
          >
            {saving ? "Saving..." : saved ? "Saved" : "Save this guide"}
          </button>
        </div>
      )}

      {/* Guide content or gate */}
      {hasAccess ? (
        <>
          <article
            className="glass-strong mt-8 rounded-2xl p-6 text-sm leading-relaxed sm:p-8 animate-fade-up stagger-2"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.content) }}
          />

          {/* Helpful prompt */}
          <div className="glass mt-8 rounded-2xl p-6 text-center animate-fade-up stagger-3">
            <p className="font-medium">Was this guide helpful?</p>
            {helpful === null ? (
              <div className="mt-3 flex justify-center gap-3">
                <button
                  onClick={() => setHelpful(true)}
                  className="glass rounded-lg px-4 py-2 text-sm transition-all duration-300 hover:border-success hover:bg-success/5"
                >
                  Yes, it helped
                </button>
                <button
                  onClick={() => setHelpful(false)}
                  className="glass rounded-lg px-4 py-2 text-sm transition-all duration-300 hover:border-primary hover:bg-primary/5"
                >
                  I still need help
                </button>
              </div>
            ) : helpful ? (
              <p className="mt-2 text-sm text-success animate-fade-in">
                Glad to hear it! You can save this guide for future reference.
              </p>
            ) : (
              <div className="mt-2 text-sm text-muted animate-fade-in">
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
        </>
      ) : (
        <div className="mt-8">
          <AccessGate tier={accessTier} slug={slug} />
        </div>
      )}

      {/* Related guides */}
      {related.length > 0 && (
        <div className="mt-10 animate-fade-up stagger-4">
          <h2 className="font-semibold">Related Guides</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/guide/${r.slug}`}
                className="glass rounded-xl p-4 card-hover"
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
