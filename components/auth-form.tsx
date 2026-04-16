"use client";

import { useState, type FormEvent, type ReactNode } from "react";

interface AuthFormProps {
  title: string;
  description?: string;
  submitLabel: string;
  initialError?: string;
  onSubmit: (formData: FormData) => Promise<{ error?: string; redirect?: string; message?: string }>;
  children: ReactNode;
  footer?: ReactNode;
  disclaimer?: string;
}

export function AuthForm({
  title,
  description,
  submitLabel,
  initialError,
  onSubmit,
  children,
  footer,
  disclaimer,
}: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = new FormData(e.currentTarget);
      const result = await onSubmit(data);

      if (result.error) {
        setError(result.error);
      } else if (result.redirect) {
        window.location.href = result.redirect;
      } else if (result.message) {
        setSuccess(result.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-border bg-background p-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
              {success}
            </div>
          )}

          {children}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? "Please wait\u2026" : submitLabel}
          </button>
        </form>

        {disclaimer && (
          <p className="disclaimer mt-4 text-center">{disclaimer}</p>
        )}
        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      </div>
    </div>
  );
}

export function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...props}
        className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </label>
  );
}
