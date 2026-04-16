import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Verify Your Email" };

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="rounded-2xl border border-border bg-background p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
          ✉
        </div>
        <h1 className="mt-6 text-2xl font-bold">Check your email</h1>
        <p className="mt-3 text-sm text-muted">
          We sent you a verification link. Click it to activate your account.
        </p>
        <p className="mt-4 text-sm text-muted">
          Didn&apos;t get the email? Check your spam folder or{" "}
          <Link href="/register" className="text-primary hover:underline">
            request a new link
          </Link>
          .
        </p>
        <Link href="/login" className="btn-secondary mt-8 inline-flex">
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
