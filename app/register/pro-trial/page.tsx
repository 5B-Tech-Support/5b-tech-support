"use client";

import Link from "next/link";
import { AuthForm, Input } from "@/components/auth-form";

export default function ProTrialPage() {
  return (
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

        const res = await fetch("/api/auth/signup-pro-trial", {
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
          {" \u00b7 "}
          <Link href="/register" className="text-primary hover:underline">
            Free account instead
          </Link>
        </>
      }
    >
      <Input label="Full name" name="full_name" type="text" required autoComplete="name" />
      <Input label="Email" name="email" type="email" required autoComplete="email" />
      <Input label="Password" name="password" type="password" required minLength={6} autoComplete="new-password" />
      <Input label="Confirm password" name="confirm_password" type="password" required minLength={6} autoComplete="new-password" />
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
