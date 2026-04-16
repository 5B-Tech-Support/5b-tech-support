import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="text-3xl font-bold sm:text-4xl">Get in touch.</h1>
      <p className="mt-6 text-lg">
        Email:{" "}
        <a
          href="mailto:support@5btechsupport.com"
          className="text-primary hover:underline"
        >
          support@5btechsupport.com
        </a>
      </p>
      <div className="mt-8 space-y-4 text-sm text-muted">
        <p>
          For account and billing issues, please use the support ticket system
          inside your account.
        </p>
        <p>We typically respond to emails within 3 business days.</p>
      </div>
    </div>
  );
}
