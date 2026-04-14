"use client";

import Link from "next/link";
import { AuthForm, Input } from "@/components/auth-form";

export default function ProTrialPage() {
  return (
    <AuthForm
      title="Start your 30-day Pro trial"
      description="Full access to every guide and faster email support — no credit card required."
      submitLabel="Start free trial"
      onSubmit={async (formData) => {
        const res = await fetch("/api/auth/signup-pro-trial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.get("email"),
            password: formData.get("password"),
            full_name: formData.get("full_name"),
          }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error ?? "Sign up failed" };
        return { message: data.message ?? "Check your email for a verification link." };
      }}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
          {" · "}
          <Link href="/register" className="text-primary hover:underline">
            Free account instead
          </Link>
        </>
      }
    >
      <Input label="Full name" name="full_name" type="text" autoComplete="name" />
      <Input label="Email" name="email" type="email" required autoComplete="email" />
      <Input label="Password" name="password" type="password" required minLength={6} autoComplete="new-password" />
    </AuthForm>
  );
}
