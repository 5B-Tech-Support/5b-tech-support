"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const categoryOptions = [
  "Wi-Fi & Networking",
  "Printers & Scanners",
  "Email & Accounts",
  "Viruses & Security",
  "Speed & Performance",
  "Software Installation",
  "Bluetooth",
  "Browser Issues",
  "Storage & Cleanup",
  "Settings & Errors",
  "Other",
];

export default function NewTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/support/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        os_type: form.get("os_type") || null,
        issue_category: form.get("issue_category") || null,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    router.push(`/support/tickets/${data.ticket.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold">New Support Ticket</h1>
      <p className="mt-2 text-sm text-muted">
        One ticket covers one issue. Please describe your problem in detail.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <div className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-medium">Subject</span>
          <input
            name="title"
            required
            className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="e.g. Can't connect to Wi-Fi after update"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Operating system</span>
            <select
              name="os_type"
              defaultValue="windows11"
              className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="windows11">Windows 11</option>
              <option value="macos">macOS</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Category</span>
            <select
              name="issue_category"
              className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Select...</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Describe your issue</span>
          <textarea
            name="description"
            required
            rows={6}
            className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Tell us what's happening, what you've already tried, and any error messages you see."
          />
        </label>

        <div>
          <span className="text-sm font-medium">Screenshots (up to 3)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="mt-1 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-medium file:text-primary"
          />
          <p className="mt-1 text-xs text-muted">
            Upload images to help show what you&apos;re seeing on your screen.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>

        <p className="disclaimer">
          Support is provided for educational guidance only. We do not remotely
          access your computer or install software.
        </p>
      </form>
    </div>
  );
}
