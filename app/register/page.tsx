"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AuthForm, Input } from "@/components/auth-form";

function TrialConfirmModal({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? "bg-foreground/20 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={onCancel}
    >
      <div
        className={`glass-strong w-full max-w-sm rounded-2xl p-6 shadow-lg transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{ boxShadow: "var(--glow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
          style={{ background: "var(--accent-gradient)" }}
        >
          ✦
        </div>
        <h3 className="text-center text-lg font-bold">Activate Pro Free Trial</h3>
        <p className="mt-3 text-center text-sm text-muted leading-relaxed">
          You are choosing to activate a <strong className="text-foreground">1-month free trial</strong> of
          the Pro plan starting today. After the trial ends, your account will
          automatically revert to the Free plan. <strong className="text-foreground">You will not owe
          anything</strong> at that date.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1 !py-2.5 !text-sm"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary flex-1 !py-2.5 !text-sm"
          >
            Start Trial
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [submitResolver, setSubmitResolver] = useState<{
    resolve: (value: { error?: string; redirect?: string; message?: string }) => void;
  } | null>(null);

  const doSignup = useCallback(async (formData: FormData, selectedPlan: "free" | "pro") => {
    const email = formData.get("email") as string;
    const firstName = (formData.get("first_name") as string).trim();
    const lastName = (formData.get("last_name") as string).trim();
    const endpoint = selectedPlan === "pro" ? "/api/auth/signup-pro-trial" : "/api/auth/signup";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: formData.get("password"),
        full_name: `${firstName} ${lastName}`,
      }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Sign up failed" };
    return { redirect: `/verify-email?email=${encodeURIComponent(email)}` };
  }, []);

  function handleTrialConfirm() {
    setShowTrialModal(false);
    if (pendingFormData && submitResolver) {
      doSignup(pendingFormData, "pro").then(submitResolver.resolve);
    }
  }

  function handleTrialCancel() {
    setShowTrialModal(false);
    if (submitResolver) {
      submitResolver.resolve({});
    }
    setPendingFormData(null);
    setSubmitResolver(null);
  }

  return (
    <>
      <TrialConfirmModal
        open={showTrialModal}
        onConfirm={handleTrialConfirm}
        onCancel={handleTrialCancel}
      />

      <AuthForm
        title="Create your account"
        description="Get started with 5B Tech Support."
        submitLabel="Create Account"
        disclaimer="Your account is secured by Supabase. We never see your password."
        onSubmit={async (formData) => {
          const password = formData.get("password") as string;
          const confirm = formData.get("confirm_password") as string;
          if (password !== confirm) return { error: "Passwords do not match." };

          const agreed = formData.get("agree_tos");
          if (!agreed) return { error: "You must agree to the Terms of Service and Privacy Policy." };

          if (plan === "pro") {
            setPendingFormData(formData);
            return new Promise((resolve) => {
              setSubmitResolver({ resolve });
              setShowTrialModal(true);
            });
          }

          return doSignup(formData, "free");
        }}
        footer={
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" name="first_name" type="text" required autoComplete="given-name" />
          <Input label="Last name" name="last_name" type="text" required autoComplete="family-name" />
        </div>
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <Input label="Password" name="password" type="password" required minLength={6} autoComplete="new-password" />
        <Input label="Confirm password" name="confirm_password" type="password" required minLength={6} autoComplete="new-password" />

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Choose your plan</legend>
          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-300 ${plan === "free" ? "border-primary glass-strong" : "border-border glass"}`}>
            <input
              type="radio"
              name="plan"
              value="free"
              checked={plan === "free"}
              onChange={() => setPlan("free")}
              className="accent-primary"
            />
            <div>
              <span className="font-medium">Free</span>
              <span className="ml-2 text-sm text-muted">$0/month</span>
            </div>
          </label>
          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-300 ${plan === "pro" ? "border-primary glass-strong" : "border-border glass"}`}>
            <input
              type="radio"
              name="plan"
              value="pro"
              checked={plan === "pro"}
              onChange={() => setPlan("pro")}
              className="accent-primary"
            />
            <div className="flex items-center gap-2">
              <span className="font-medium">Pro</span>
              <span className="text-sm text-muted">$3.99/month</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                1-month free trial
              </span>
            </div>
          </label>
        </fieldset>

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
