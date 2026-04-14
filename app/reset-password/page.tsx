"use client";

import Link from "next/link";
import { AuthForm, Input } from "@/components/auth-form";

export default function ResetPasswordPage() {
  return (
    <AuthForm
      title="Set a new password"
      description="Enter your new password below."
      submitLabel="Update password"
      onSubmit={async (formData) => {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: formData.get("password") }),
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
      <Input
        label="New password"
        name="password"
        type="password"
        required
        minLength={6}
        autoComplete="new-password"
      />
    </AuthForm>
  );
}
