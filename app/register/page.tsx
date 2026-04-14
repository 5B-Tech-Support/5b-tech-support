"use client";

import Link from "next/link";
import { AuthForm, Input } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <AuthForm
      title="Create your free account"
      description="Get access to our tutorial library and email support."
      submitLabel="Create account"
      onSubmit={async (formData) => {
        const res = await fetch("/api/auth/signup", {
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
          <Link href="/register/pro-trial" className="text-primary hover:underline">
            Start Pro trial instead
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
