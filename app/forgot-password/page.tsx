"use client";

import Link from "next/link";
import { AuthForm, Input } from "@/components/auth-form";

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      title="Forgot your password?"
      description="We'll send you an email with a link to reset your password."
      submitLabel="Send Reset Link"
      onSubmit={async (formData) => {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.get("email") }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error ?? "Request failed" };
        return {
          message:
            data.message ??
            "If an account exists with that email, a reset link has been sent.",
        };
      }}
      footer={
        <Link href="/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <Input label="Email" name="email" type="email" required autoComplete="email" />
    </AuthForm>
  );
}
