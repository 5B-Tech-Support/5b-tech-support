"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  GuideEditorForm,
  emptyGuideForm,
  type GuideEditorFormRef,
} from "@/components/manage-content/guide-editor-form";

export default function NewTutorialPage() {
  const router = useRouter();
  const formRef = useRef<GuideEditorFormRef>(null);
  const [dirty, setDirty] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveSaving, setLeaveSaving] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const requestLeave = useCallback(() => {
    if (!dirty) {
      router.push("/manage-content");
      return;
    }
    setLeaveError(null);
    setLeaveOpen(true);
  }, [dirty, router]);

  const stayOnPage = useCallback(() => {
    setLeaveOpen(false);
    setLeaveError(null);
  }, []);

  const saveDraftAndLeave = useCallback(async () => {
    setLeaveSaving(true);
    setLeaveError(null);
    const result = await formRef.current?.saveAsDraft();
    if (!result?.ok) {
      setLeaveError(result?.error ?? "Could not save draft");
      setLeaveSaving(false);
      return;
    }
    setLeaveSaving(false);
    setLeaveOpen(false);
    router.push("/manage-content");
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={requestLeave}
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Back to Manage Content
          </button>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">New tutorial</h1>
          <p className="mt-1 text-sm text-muted">
            Drafts are not visible on the site until you publish. Upload a thumbnail or video from
            your device, or paste URLs.
          </p>
        </div>
      </div>

      <GuideEditorForm
        ref={formRef}
        editingId={null}
        initialForm={emptyGuideForm}
        variant="page"
        onDirtyChange={setDirty}
        onSuccess={() => router.push("/manage-content")}
      />

      {leaveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-title"
            className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
          >
            <h2 id="leave-title" className="text-lg font-bold">
              Are you sure?
            </h2>
            <p className="mt-2 text-sm text-muted">
              You have unsaved changes. If you leave without saving, your work may be lost.
            </p>
            {leaveError && (
              <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                {leaveError}
              </p>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <button
                type="button"
                onClick={() => void saveDraftAndLeave()}
                disabled={leaveSaving}
                className="btn-primary order-1 sm:order-none"
              >
                {leaveSaving ? "Saving…" : "Yes, save as draft"}
              </button>
              <button
                type="button"
                onClick={stayOnPage}
                disabled={leaveSaving}
                className="btn-secondary"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
