"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const osOptions = [
  { value: "windows11", label: "Windows 11" },
  { value: "macos", label: "macOS" },
];

const categoryOptions = [
  "Wi-Fi & Networking",
  "Printers & Scanners",
  "Email & Accounts",
  "Viruses & Security",
  "Speed & Performance",
  "Software Installation",
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
      <p className="mt-1 text-sm text-muted">
        Describe your issue and our team will get back to you.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <div className="rounded-md bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-medium">Subject</span>
          <input
            name="title"
            required
            className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted"
            placeholder="e.g. Can't connect to Wi-Fi after update"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Operating system</span>
            <select
              name="os_type"
              className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
            >
              <option value="">Select...</option>
              {osOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Category</span>
            <select
              name="issue_category"
              className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
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
            className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted"
            placeholder="Tell us what's happening, what you've already tried, and any error messages you see."
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit ticket"}
        </button>
      </form>
    </div>
  );
}
