import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: April 15, 2026</p>

      <div className="prose mt-10 max-w-none space-y-6 text-sm leading-relaxed">
        <p>
          5B Tech Support (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) respects your privacy. This Privacy Policy explains
          how we collect, use, and protect your information when you use our
          website and services (&ldquo;Service&rdquo;).
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          1. Information We Collect
        </h2>
        <p>
          <strong>Account information:</strong> When you create an account, we
          collect your name, email address, and password.{" "}
          <strong>Payment information:</strong> If you subscribe to the Pro plan,
          payment is processed by Stripe. We do not store your credit card
          number. Stripe may collect payment details directly.{" "}
          <strong>Support ticket content:</strong> When you submit a support
          ticket, we collect the text, screenshots, and attachments you provide.{" "}
          <strong>Usage data:</strong> We may collect basic usage information
          such as pages viewed, features used, and login times to improve the
          Service. <strong>Device information:</strong> We may collect your
          browser type and operating system to improve compatibility.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          2. How We Use Your Information
        </h2>
        <p>
          We use your information to: provide and improve the Service, respond to
          support tickets, process payments through Stripe, communicate with you
          about your account, and ensure security and prevent abuse.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          3. What We Do Not Do
        </h2>
        <p>
          We do not sell your personal information to anyone. We do not share
          your personal information with advertisers. We do not display ads on
          the Service. We do not use your information for targeted advertising.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          4. Third-Party Services
        </h2>
        <p>
          We use the following third-party services: Supabase for authentication
          and data storage, and Stripe for payment processing. These services
          have their own privacy policies. We encourage you to review them.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">5. Data Retention</h2>
        <p>
          We retain your account data for as long as your account is active. If
          you delete your account, we will remove your personal data within 30
          days, except where retention is required by law.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">6. Data Security</h2>
        <p>
          We use industry-standard security measures to protect your information.
          However, no method of transmission over the internet is completely
          secure. We cannot guarantee absolute security.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">7. Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          information by contacting us at{" "}
          <a
            href="mailto:support@5btechsupport.com"
            className="text-primary hover:underline"
          >
            support@5btechsupport.com
          </a>{" "}
          or through your account Settings page.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          8. Children&apos;s Privacy
        </h2>
        <p>
          The Service is not intended for children under 13. We do not knowingly
          collect personal information from children under 13.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          9. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy at any time. Material changes will be
          communicated through the Service.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">10. Contact</h2>
        <p>
          For privacy-related questions, contact us at{" "}
          <a
            href="mailto:support@5btechsupport.com"
            className="text-primary hover:underline"
          >
            support@5btechsupport.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
