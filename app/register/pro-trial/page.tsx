"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthForm, Input, PasswordInput } from "@/components/auth-form";

function AccountExistsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!open) {
      setCountdown(5);
      return;
    }
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          router.push("/login");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [open, router]);

  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div className="glass-strong w-full max-w-sm rounded-2xl p-6 shadow-lg animate-fade-up"
        style={{ boxShadow: "var(--glow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
          style={{ background: "var(--accent-gradient)" }}
        >
          👋
        </div>
        <h3 className="text-center text-lg font-bold">Account already exists</h3>
        <p className="mt-3 text-center text-sm text-muted leading-relaxed">
          An account with this email address already exists.
          Redirecting you to the login page in <strong className="text-foreground">{countdown}s</strong>.
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 !py-2.5 !text-sm">
            Stay Here
          </button>
          <button onClick={() => router.push("/login")} className="btn-primary flex-1 !py-2.5 !text-sm">
            Go to Login
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export default function ProTrialPage() {
  const [showExistsModal, setShowExistsModal] = useState(false);

  return (
    <>
      <AccountExistsModal
        open={showExistsModal}
        onClose={() => setShowExistsModal(false)}
      />

      <AuthForm
        title="Start your 30-day Pro trial"
        description="Full access to every guide and faster email support. No credit card required."
        submitLabel="Start Free Trial"
        disclaimer="Your account is secured by Supabase. We never see your password."
        onSubmit={async (formData) => {
          const password = formData.get("password") as string;
          const confirm = formData.get("confirm_password") as string;
          if (password !== confirm) return { error: "Passwords do not match." };

          const agreed = formData.get("agree_tos");
          if (!agreed) return { error: "You must agree to the Terms of Service and Privacy Policy." };

          const email = formData.get("email") as string;
          const firstName = (formData.get("first_name") as string).trim();
          const lastName = (formData.get("last_name") as string).trim();

          const res = await fetch("/api/auth/signup-pro-trial", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              full_name: `${firstName} ${lastName}`,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            const msg = (data.error ?? "").toLowerCase();
            if (msg.includes("already registered") || msg.includes("already been registered") || msg.includes("user already exists")) {
              setShowExistsModal(true);
              return {};
            }
            return { error: data.error ?? "Sign up failed" };
          }
          return { redirect: `/verify-email?email=${encodeURIComponent(email)}` };
        }}
        footer={
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
            {" \u00b7 "}
            <Link href="/register" className="text-primary hover:underline">
              Free account instead
            </Link>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" name="first_name" type="text" required autoComplete="given-name" />
          <Input label="Last name" name="last_name" type="text" required autoComplete="family-name" />
        </div>
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <PasswordInput label="Password" name="password" required minLength={6} autoComplete="new-password" />
        <PasswordInput label="Confirm password" name="confirm_password" required minLength={6} autoComplete="new-password" />
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="agree_tos" className="mt-1 accent-primary" />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline" target="_blank">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline" target="_blank">
              Privacy Policy
            </Link>
          </span>
        </label>
      </AuthForm>
    </>
  );
}
