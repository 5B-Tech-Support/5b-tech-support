"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthForm, Input } from "@/components/auth-form";

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "The verification link was invalid or incomplete. Please try again.",
  invalid_code: "The verification link has expired or already been used. Please request a new one.",
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  return (
    <AuthForm
      title="Welcome back"
      description="Sign in to your 5B Tech Support account."
      submitLabel="Sign in"
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
        return { redirect: "/account" };
      }}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <Input label="Email" name="email" type="email" required autoComplete="email" />
      <Input label="Password" name="password" type="password" required autoComplete="current-password" />
      <div className="text-right">
        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
          Forgot password?
        </Link>
      </div>
    </AuthForm>
  );
}
