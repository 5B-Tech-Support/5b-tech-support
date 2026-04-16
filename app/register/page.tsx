"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthForm, Input } from "@/components/auth-form";

export default function RegisterPage() {
  const [plan, setPlan] = useState<"free" | "pro">("free");

  return (
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

        const endpoint = plan === "pro" ? "/api/auth/signup-pro-trial" : "/api/auth/signup";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.get("email"),
            password,
            full_name: formData.get("full_name"),
          }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error ?? "Sign up failed" };
        return { redirect: "/verify-email" };
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
      <Input label="Full name" name="full_name" type="text" required autoComplete="name" />
      <Input label="Email" name="email" type="email" required autoComplete="email" />
      <Input label="Password" name="password" type="password" required minLength={6} autoComplete="new-password" />
      <Input label="Confirm password" name="confirm_password" type="password" required minLength={6} autoComplete="new-password" />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Choose your plan</legend>
        <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${plan === "free" ? "border-primary bg-primary/5" : "border-border"}`}>
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
        <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${plan === "pro" ? "border-primary bg-primary/5" : "border-border"}`}>
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
  );
}
