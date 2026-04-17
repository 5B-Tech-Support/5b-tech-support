"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Guide } from "@/types/database";
import {
  GuideEditorForm,
  emptyGuideForm,
  type GuideFormState,
} from "@/components/manage-content/guide-editor-form";

type Tab = "published" | "drafts" | "deleted";

export default function ManageContentPage() {
  const [tab, setTab] = useState<Tab>("published");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorInitial, setEditorInitial] = useState<GuideFormState>(emptyGuideForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchGuides = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/guides?tab=${tab}&limit=100`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to load guides");
        setGuides([]);
      } else {
        setGuides(data.guides ?? []);
        setError(null);
      }
    } catch {
      setError("Failed to load guides");
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    void fetchGuides();
  }, [fetchGuides]);

  function openEdit(guide: Guide) {
    setEditingId(guide.id);
    setEditorInitial({
      slug: guide.slug,
      title: guide.title,
      description: guide.description,
      category: guide.category,
      os_type: guide.os_type,
      tier_required: guide.tier_required,
      difficulty: guide.difficulty,
      estimated_minutes: guide.estimated_minutes,
      thumbnail_url: guide.thumbnail_url ?? "",
      video_url: guide.video_url ?? "",
      content: guide.content,
      is_published: guide.is_published,
    });
    setShowForm(true);
  }

  async function handleSoftDelete(id: string) {
    try {
      await fetch(`/api/admin/guides/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      void fetchGuides();
    } catch {
      setError("Delete failed");
    }
  }

  async function handleRestore(id: string) {
    try {
      const res = await fetch(`/api/admin/guides/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleted_at: null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Restore failed");
        return;
      }
      void fetchGuides();
    } catch {
      setError("Restore failed");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Content</h1>
          <p className="mt-1 text-sm text-muted">
            Tutorials, drafts, and deleted guides. Create or edit guides and optional video
            walkthroughs.
          </p>
        </div>
        <Link href="/manage-content/new" className="btn-primary shrink-0 text-center">
          New tutorial
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-3">
        {(
          [
            ["published", "Published"],
            ["drafts", "Drafts"],
            ["deleted", "Deleted"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === key
                ? "bg-primary text-primary-foreground"
                : "text-muted hover:bg-surface/80 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      {showForm && editingId && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-foreground/20 p-4 pt-12">
          <GuideEditorForm
            key={editingId}
            editingId={editingId}
            initialForm={editorInitial}
            variant="modal"
            onCancel={() => {
              setShowForm(false);
              setEditingId(null);
            }}
            onSuccess={() => {
              setShowForm(false);
              setEditingId(null);
              void fetchGuides();
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-muted">Loading...</p>
      ) : guides.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Nothing in this tab yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Tier</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium">{guide.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{guide.slug}</td>
                  <td className="px-4 py-3 capitalize text-muted">{guide.tier_required}</td>
                  <td className="px-4 py-3">
                    {tab === "deleted" ? (
                      <span className="text-xs text-muted">Removed</span>
                    ) : (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          guide.is_published
                            ? "bg-success/10 text-success"
                            : "bg-surface text-muted"
                        }`}
                      >
                        {guide.is_published ? "Published" : "Draft"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {tab === "deleted" ? (
                        <button
                          type="button"
                          onClick={() => void handleRestore(guide.id)}
                          className="text-xs text-primary hover:underline"
                        >
                          Restore
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => openEdit(guide)}
                            className="text-xs text-primary hover:underline"
                          >
                            Edit
                          </button>
                          {deleteConfirm === guide.id ? (
                            <span className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => void handleSoftDelete(guide.id)}
                                className="text-xs text-danger hover:underline"
                              >
                                Confirm remove
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirm(null)}
                                className="text-xs text-muted hover:underline"
                              >
                                Cancel
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(guide.id)}
                              className="text-xs text-danger hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
