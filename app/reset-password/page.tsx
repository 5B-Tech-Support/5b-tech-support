"use client";

import Link from "next/link";
import { AuthForm, Input } from "@/components/auth-form";

export default function ResetPasswordPage() {
  return (
    <AuthForm
      title="Reset your password"
      description="Enter your new password below."
      submitLabel="Reset Password"
      onSubmit={async (formData) => {
        const password = formData.get("password") as string;
        const confirm = formData.get("confirm_password") as string;
        if (password !== confirm) return { error: "Passwords do not match." };

        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error ?? "Reset failed" };
        return { redirect: "/login" };
      }}
      footer={
        <Link href="/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <Input label="New password" name="password" type="password" required minLength={6} autoComplete="new-password" />
      <Input label="Confirm new password" name="confirm_password" type="password" required minLength={6} autoComplete="new-password" />
    </AuthForm>
  );
}
