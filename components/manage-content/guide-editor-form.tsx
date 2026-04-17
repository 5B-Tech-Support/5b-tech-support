"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
} from "react";

export const CATEGORIES = [
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
] as const;

export type GuideFormState = {
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

export const emptyGuideForm: GuideFormState = {
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

export type GuideEditorFormRef = {
  saveAsDraft: () => Promise<{ ok: boolean; error?: string }>;
};

type GuideEditorFormProps = {
  editingId: string | null;
  initialForm: GuideFormState;
  variant: "page" | "modal";
  onSuccess: () => void;
  onCancel?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

function buildPayload(form: GuideFormState, forceDraft: boolean) {
  return {
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
    is_published: forceDraft ? false : form.is_published,
  };
}

export const GuideEditorForm = forwardRef<GuideEditorFormRef, GuideEditorFormProps>(
  function GuideEditorForm(
    { editingId, initialForm, variant, onSuccess, onCancel, onDirtyChange },
    ref
  ) {
    const [form, setForm] = useState<GuideFormState>(initialForm);
    const [activeId, setActiveId] = useState<string | null>(editingId);
    const activeIdRef = useRef<string | null>(editingId);
    const baselineJson = useRef(JSON.stringify(initialForm));
    const formRef = useRef(form);
    formRef.current = form;

    const [saving, setSaving] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      setForm(initialForm);
      setActiveId(editingId);
      activeIdRef.current = editingId;
      baselineJson.current = JSON.stringify(initialForm);
    }, [initialForm, editingId]);

    const dirty = JSON.stringify(form) !== baselineJson.current;

    useEffect(() => {
      onDirtyChange?.(dirty);
    }, [dirty, onDirtyChange]);

    const persist = useCallback(async (forceDraft: boolean) => {
      const f = formRef.current;
      const id = activeIdRef.current;
      const url = id ? `/api/admin/guides/${id}` : "/api/admin/guides";
      const method = id ? "PATCH" : "POST";
      const payload = buildPayload(f, forceDraft);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { ok: false as const, error: (data.error as string) ?? "Save failed" };
      }
      if (!id && data.guide?.id) {
        const newId = data.guide.id as string;
        setActiveId(newId);
        activeIdRef.current = newId;
      }
      setForm((prev) => (forceDraft ? { ...prev, is_published: false } : prev));
      const next = forceDraft ? { ...f, is_published: false } : f;
      baselineJson.current = JSON.stringify(next);
      onDirtyChange?.(false);
      return { ok: true as const };
    }, [onDirtyChange]);

    useImperativeHandle(ref, () => ({
      async saveAsDraft() {
        const f = formRef.current;
        if (!f.title.trim() || !f.description.trim()) {
          return {
            ok: false,
            error: "Add a title and description to save a draft.",
          };
        }
        setError(null);
        return persist(true);
      },
    }));

    async function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setSaving(true);
      setError(null);
      const result = await persist(false);
      if (!result.ok) {
        setError(result.error ?? "Save failed");
        setSaving(false);
        return;
      }
      setSaving(false);
      onSuccess();
    }

    async function handleVideoFile(file: File | null) {
      if (!file) return;
      setUploadingVideo(true);
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
        setForm((prev) => ({ ...prev, video_url: data.url as string }));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
      setUploadingVideo(false);
    }

    async function handleThumbnailFile(file: File | null) {
      if (!file) return;
      setUploadingThumb(true);
      setError(null);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/guides/upload-thumbnail", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        setForm((prev) => ({ ...prev, thumbnail_url: data.url as string }));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
      setUploadingThumb(false);
    }

    const formClassName =
      variant === "modal"
        ? "w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-xl"
        : "rounded-2xl border border-border bg-background p-6 shadow-sm";

    const title = activeId ? "Edit tutorial" : "New tutorial";

    return (
      <form onSubmit={(e) => void handleSubmit(e)} className={formClassName}>
        <h2 className="text-lg font-bold">{title}</h2>

        {error && (
          <div className="mt-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div
          className={
            variant === "modal"
              ? "mt-4 max-h-[calc(100vh-8rem)] space-y-4 overflow-y-auto pr-1"
              : "mt-4 space-y-4"
          }
        >
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

          <div className="block">
            <span className="text-sm font-medium">Thumbnail (optional)</span>
            <p className="mt-0.5 text-xs text-muted">
              JPEG, PNG, WebP, or GIF from your device (max 5 MB), or paste a URL below. Create a
              public <code className="text-foreground">guide-thumbnails</code> bucket in Supabase
              Storage for uploads.
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-2 block w-full text-sm"
              disabled={uploadingThumb}
              onChange={(e) => void handleThumbnailFile(e.target.files?.[0] ?? null)}
            />
            <input
              value={form.thumbnail_url}
              onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
              className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="https://... (filled after upload)"
            />
            {uploadingThumb && <p className="mt-1 text-xs text-muted">Uploading...</p>}
          </div>

          <div className="block">
            <span className="text-sm font-medium">Video (optional)</span>
            <p className="mt-0.5 text-xs text-muted">
              MP4 or WebM from your device, max 150 MB. Requires a public{" "}
              <code className="text-foreground">guide-videos</code> bucket in Supabase Storage.
            </p>
            <input
              type="file"
              accept="video/mp4,video/webm"
              className="mt-2 block w-full text-sm"
              disabled={uploadingVideo}
              onChange={(e) => void handleVideoFile(e.target.files?.[0] ?? null)}
            />
            <input
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-2.5 font-mono text-xs focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Public video URL (filled after upload)"
            />
            {uploadingVideo && <p className="mt-1 text-xs text-muted">Uploading...</p>}
          </div>

          <label className="block">
            <span className="text-sm font-medium">Written tutorial (Markdown)</span>
            <textarea
              rows={variant === "page" ? 16 : 12}
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

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : activeId ? "Save changes" : "Create tutorial"}
          </button>
          {variant === "modal" && onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  }
);
