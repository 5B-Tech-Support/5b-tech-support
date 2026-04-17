"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Guide } from "@/types/database";

const CATEGORIES = [
  "Performance", "Security", "Printer", "Internet", "Email",
  "Storage", "Bluetooth", "Apps", "Browser", "Settings",
];

type FormState = {
  title: string;
  description: string;
  category: string;
  os_type: string;
  tier_required: string;
  difficulty: string;
  estimated_minutes: number;
  content: string;
  is_published: boolean;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  category: "Performance",
  os_type: "windows11",
  tier_required: "free",
  difficulty: "beginner",
  estimated_minutes: 5,
  content: "",
  is_published: false,
};

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function fetchGuides() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guides");
      if (res.status === 403) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setGuides(data.guides ?? []);
    } catch {
      setError("Failed to load guides");
    }
    setLoading(false);
  }

  useEffect(() => { fetchGuides(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(guide: Guide) {
    setEditingId(guide.id);
    setForm({
      title: guide.title,
      description: guide.description,
      category: guide.category,
      os_type: guide.os_type,
      tier_required: guide.tier_required,
      difficulty: guide.difficulty,
      estimated_minutes: guide.estimated_minutes,
      content: guide.content,
      is_published: guide.is_published,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = editingId
      ? `/api/admin/guides/${editingId}`
      : "/api/admin/guides";
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed");
        setSaving(false);
        return;
      }
      setShowForm(false);
      setEditingId(null);
      fetchGuides();
    } catch {
      setError("Save failed");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/admin/guides/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchGuides();
    } catch {
      setError("Delete failed");
    }
  }

  if (!authorized) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted">You need admin privileges to view this page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Guides</h1>
        <button onClick={openCreate} className="btn-primary">
          Create Guide
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-foreground/20 p-4 pt-20">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold">
              {editingId ? "Edit Guide" : "Create Guide"}
            </h2>

            <div className="mt-4 space-y-4">
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

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-medium">Category</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Tier</span>
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
                  onChange={(e) => setForm({ ...form, estimated_minutes: parseInt(e.target.value) || 5 })}
                  className="mt-1 block w-32 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Content (Markdown)</span>
                <textarea
                  rows={10}
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
                Published
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Guide"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="mt-8 text-sm text-muted">Loading guides...</p>
      ) : guides.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No guides yet. Create your first one.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Tier</th>
                <th className="px-4 py-3 font-medium">Difficulty</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium">{guide.title}</td>
                  <td className="px-4 py-3 text-muted">{guide.category}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      guide.tier_required === "pro"
                        ? "bg-primary/10 text-primary"
                        : "bg-surface text-muted"
                    }`}>
                      {guide.tier_required}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted">{guide.difficulty}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      guide.is_published
                        ? "bg-success/10 text-success"
                        : "bg-surface text-muted"
                    }`}>
                      {guide.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(guide)}
                        className="text-xs text-primary hover:underline"
                      >
                        Edit
                      </button>
                      {deleteConfirm === guide.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(guide.id)}
                            className="text-xs text-danger hover:underline"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-xs text-muted hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(guide.id)}
                          className="text-xs text-danger hover:underline"
                        >
                          Delete
                        </button>
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
