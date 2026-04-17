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
      <div className="glass-strong rounded-2xl p-8 animate-fade-up">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="animate-fade-in rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger backdrop-blur-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="animate-fade-in rounded-xl bg-success/10 px-4 py-3 text-sm text-success backdrop-blur-sm">
              {success}
            </div>
          )}

          {children}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? "Please wait..." : submitLabel}
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
        className="mt-1 block w-full rounded-xl border border-border bg-surface/50 backdrop-blur-sm px-4 py-2.5 text-sm placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
      />
    </label>
  );
}

export function PasswordInput({
  label,
  ...props
}: { label: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [show, setShow] = useState(false);

  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative mt-1">
        <input
          {...props}
          type={show ? "text" : "password"}
          className="block w-full rounded-xl border border-border bg-surface/50 backdrop-blur-sm px-4 py-2.5 pr-11 text-sm placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors duration-200"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </label>
  );
}
