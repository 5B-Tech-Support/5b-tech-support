"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function VerifyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];

    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      digits.forEach((d, i) => {
        if (index + i < 6) newCode[index + i] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = code.join("");
    if (token.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabase();
      const { error: otpError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (otpError) {
        setError(otpError.message);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/activate", { method: "POST" });
      if (!res.ok) {
        // non-critical, profile activation can happen later
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0 || !email) return;
    setResendCooldown(60);
    setError(null);

    try {
      const supabase = getSupabase();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (resendError) {
        setError(resendError.message);
      }
    } catch {
      setError("Could not resend code.");
    }
  }

  if (!email) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="glass-strong rounded-2xl p-8 animate-fade-up">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
            style={{ background: "var(--accent-gradient)" }}
          >
            ✉
          </div>
          <h1 className="mt-6 text-2xl font-bold">Check your email</h1>
          <p className="mt-3 text-sm text-muted">
            We sent a 6-digit verification code to your email. Please check your inbox.
          </p>
          <Link href="/login" className="btn-secondary mt-8 inline-flex">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="glass-strong rounded-2xl p-8 animate-fade-up" style={{ boxShadow: "var(--glow-md)" }}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
          style={{ background: "var(--accent-gradient)" }}
        >
          {success ? "✓" : "✉"}
        </div>

        {success ? (
          <div className="animate-fade-in">
            <h1 className="mt-6 text-2xl font-bold">Email verified!</h1>
            <p className="mt-3 text-sm text-muted">
              Your account is active. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <>
            <h1 className="mt-6 text-2xl font-bold">Enter verification code</h1>
            <p className="mt-3 text-sm text-muted">
              We sent a 6-digit code to{" "}
              <strong className="text-foreground">{email}</strong>
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              {error && (
                <div className="mb-4 animate-fade-in rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-2">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="h-14 w-12 rounded-xl border border-border bg-surface/50 backdrop-blur-sm text-center text-xl font-bold
                      focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || code.join("").length !== 6}
                className="btn-primary mt-6 w-full py-3"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-muted">
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="text-primary hover:underline disabled:opacity-50 disabled:no-underline"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend code"}
                </button>
              </p>
              <p className="text-xs text-muted">
                Check your spam folder if you don&apos;t see it.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="glass-strong rounded-2xl p-8 animate-pulse">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-surface" />
          <div className="mt-6 mx-auto h-8 w-48 rounded bg-surface" />
        </div>
      </div>
    }>
      <VerifyForm />
    </Suspense>
  );
}
