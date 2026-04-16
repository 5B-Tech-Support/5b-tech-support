"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthForm, Input } from "@/components/auth-form";

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "The verification link was invalid or incomplete. Please try again.",
  invalid_code: "The verification link has expired or already been used. Please request a new one.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  return (
    <AuthForm
      title="Sign in"
      description="Welcome back to 5B Tech Support."
      submitLabel="Sign In"
      initialError={callbackError ? ERROR_MESSAGES[callbackError] ?? "Something went wrong. Please try again." : undefined}
      onSubmit={async (formData) => {
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.get("email"),
            password: formData.get("password"),
          }),
        });
        const data = await res.json();
        if (!res.ok) return { error: data.error ?? "Sign in failed" };
        return { redirect: "/dashboard" };
      }}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <Input label="Email" name="email" type="email" required autoComplete="email" />
      <Input label="Password" name="password" type="password" required autoComplete="current-password" />
      <div className="text-right">
        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
          Forgot your password?
        </Link>
      </div>
    </AuthForm>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
