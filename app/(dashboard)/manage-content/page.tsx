"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Guide } from "@/types/database";

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

type Tab = "published" | "drafts" | "deleted";

type FormState = {
  slug: string;
  title: string;
  description: string;
  category: string;
  os_type: string;
  tier_required: string;
  difficulty: string;
  estimated_minutes: number;
  thumbnail_url: string;
  video_url: string;
  content: string;
  is_published: boolean;
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  description: "",
  category: "Performance",
  os_type: "windows11",
  tier_required: "free",
  difficulty: "beginner",
  estimated_minutes: 5,
  thumbnail_url: "",
  video_url: "",
  content: "",
  is_published: false,
};

export default function ManageContentPage() {
  const [tab, setTab] = useState<Tab>("published");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(guide: Guide) {
    setEditingId(guide.id);
    setForm({
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = editingId ? `/api/admin/guides/${editingId}` : "/api/admin/guides";
    const method = editingId ? "PATCH" : "POST";

    const payload = {
      slug: form.slug.trim() || undefined,
      title: form.title,
      description: form.description,
      category: form.category,
      os_type: form.os_type,
      tier_required: form.tier_required,
      difficulty: form.difficulty,
      estimated_minutes: form.estimated_minutes,
      thumbnail_url: form.thumbnail_url.trim() || null,
      video_url: form.video_url.trim() || null,
      content: form.content,
      is_published: form.is_published,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed");
        setSaving(false);
        return;
      }
      setShowForm(false);
      setEditingId(null);
      void fetchGuides();
    } catch {
      setError("Save failed");
    }
    setSaving(false);
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

  async function handleVideoFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/guides/upload-video", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setForm((f) => ({ ...f, video_url: data.url as string }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Content</h1>
          <p className="mt-1 text-sm text-muted">
            Tutorials, drafts, and deleted guides. Create or edit guides and optional video walkthroughs.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary shrink-0">
          New tutorial
        </button>
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-foreground/20 p-4 pt-12">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold">{editingId ? "Edit tutorial" : "New tutorial"}</h2>

            <div className="mt-4 max-h-[calc(100vh-8rem)] space-y-4 overflow-y-auto pr-1">
              <label className="block">
                <span className="text-sm font-medium">URL slug</span>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. fix-printer-offline"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Title</span>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Description</span>
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">OS</span>
                  <select
                    value={form.os_type}
                    onChange={(e) => setForm({ ...form, os_type: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="windows11">Windows 11</option>
                    <option value="macos">macOS</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Category</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Library</span>
                  <select
                    value={form.tier_required}
                    onChange={(e) => setForm({ ...form, tier_required: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Difficulty</span>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium">Estimated time (minutes)</span>
                <input
                  type="number"
                  min={1}
                  value={form.estimated_minutes}
                  onChange={(e) =>
                    setForm({ ...form, estimated_minutes: parseInt(e.target.value) || 5 })
                  }
                  className="mt-1 block w-32 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Thumbnail URL (optional)</span>
                <input
                  value={form.thumbnail_url}
                  onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="https://..."
                />
              </label>

              <div className="block">
                <span className="text-sm font-medium">Video (optional)</span>
                <p className="mt-0.5 text-xs text-muted">
                  MP4 or WebM, max 150 MB. Requires a public <code className="text-foreground">guide-videos</code>{" "}
                  bucket in Supabase Storage.
                </p>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  className="mt-2 block w-full text-sm"
                  disabled={uploading}
                  onChange={(e) => void handleVideoFile(e.target.files?.[0] ?? null)}
                />
                <input
                  value={form.video_url}
                  onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                  className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-2.5 font-mono text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Public video URL (filled after upload)"
                />
                {uploading && <p className="mt-1 text-xs text-muted">Uploading...</p>}
              </div>

              <label className="block">
                <span className="text-sm font-medium">Written tutorial (Markdown)</span>
                <textarea
                  rows={12}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="## Step 1: ..."
                />
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="accent-primary"
                />
                Published (live on site)
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : editingId ? "Save changes" : "Create tutorial"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
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
