"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function VerifyBillingContent() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
    });
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendCode() {
    if (!email) return;
    setError(null);
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { error: e } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (e) throw e;
      setSent(true);
      setCooldown(60);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send code");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      digits.forEach((d, i) => {
        if (index + i < 6) newCode[index + i] = d;
      });
      setCode(newCode);
      const next = Math.min(index + digits.length, 5);
      inputRefs.current[next]?.focus();
      return;
    }
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function verify() {
    if (!email) return;
    const token = code.join("");
    if (token.length !== 6) {
      setError("Enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabase();
      const { error: e } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });
      if (e) throw e;

      const res = await fetch("/api/billing/grant-access", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Could not unlock billing");
      }
      router.push("/billing/manage");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="glass-strong rounded-2xl p-8" style={{ boxShadow: "var(--glow-md)" }}>
        <h1 className="text-2xl font-bold">Verify for billing</h1>
        <p className="mt-2 text-sm text-muted">
          We will email a one-time code to confirm it is you before showing payment options.
        </p>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        {!sent ? (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => void sendCode()}
              disabled={loading || !email || cooldown > 0}
              className="btn-primary w-full py-3"
            >
              {loading ? "Sending\u2026" : cooldown > 0 ? `Resend in ${cooldown}s` : "Send verification code"}
            </button>
          </div>
        ) : (
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              void verify();
            }}
          >
            <p className="text-sm text-muted">
              Code sent to <strong className="text-foreground">{email}</strong>
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-14 w-12 rounded-xl border border-border bg-surface/50 text-center text-xl font-bold focus:border-primary focus:ring-1 focus:ring-primary"
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-6 w-full py-3">
              {loading ? "Verifying\u2026" : "Verify and continue"}
            </button>
            <button
              type="button"
              onClick={() => void sendCode()}
              disabled={cooldown > 0 || loading}
              className="mt-3 w-full text-sm text-primary hover:underline disabled:opacity-50"
            >
              Resend code
            </button>
          </form>
        )}

        <Link href="/billing" className="mt-6 block text-center text-sm text-muted hover:text-primary">
          &larr; Back to billing
        </Link>
      </div>
    </div>
  );
}

export default function BillingVerifyPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16 animate-pulse">Loading\u2026</div>}>
      <VerifyBillingContent />
    </Suspense>
  );
}
