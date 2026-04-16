import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted">Last updated: April 15, 2026</p>

      <div className="prose mt-10 max-w-none space-y-6 text-sm leading-relaxed">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the 5B
          Tech Support website and services (&ldquo;Service&rdquo;) operated by
          5B Tech Support (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;). By creating an account or using the Service, you
          agree to these Terms.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          1. Description of Service
        </h2>
        <p>
          5B Tech Support provides educational technology guides, tutorials, and
          email-based support for common Windows computer issues. All content is
          intended for informational and educational purposes only.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">2. Eligibility</h2>
        <p>
          You must be at least 13 years old to create an account. If you are
          under 18, you must have permission from a parent or guardian to use
          this Service.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">3. Accounts</h2>
        <p>
          You are responsible for maintaining the security of your account
          credentials. You must provide accurate information when creating an
          account. You may not share your account with others or create multiple
          accounts. We reserve the right to suspend or terminate accounts that
          violate these Terms.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          4. Plans and Billing
        </h2>
        <p>
          5B Tech Support offers a Free plan and a paid Pro plan. The Pro plan
          includes a 1-month free trial that does not require a credit card and
          does not auto-charge when the trial ends. If you choose to subscribe
          after the trial, billing is handled by Stripe, our third-party payment
          processor. You may cancel your subscription at any time. Cancellation
          takes effect at the end of the current billing period. We do not offer
          refunds. Plan features and pricing may change. We will provide notice
          of material changes before they take effect.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          5. Educational Content Disclaimer
        </h2>
        <p>
          All guides, tutorials, articles, videos, and other content provided
          through the Service are for educational and informational purposes
          only. The content is provided &ldquo;as is&rdquo; without warranties
          of any kind. We do not guarantee that following any guide will fix your
          problem or that our instructions are suitable for your specific device,
          software version, or situation. You follow all instructions at your own
          risk. 5B Tech Support is not responsible for any damage, data loss,
          software issues, performance problems, or any other negative outcomes
          that may result from following our content. We are not a licensed
          repair service and do not provide professional IT consulting.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">6. Support Tickets</h2>
        <p>
          Support tickets allow you to request help with a specific issue.
          Response times are goals, not guarantees. Free plan: 3 business day
          response goal. Pro plan: 48-hour response goal on business days.
          Support is limited to guidance and suggestions. We do not remotely
          access your computer, install software, or make changes to your system.
          One ticket covers one issue. Follow-up messages on the same ticket are
          allowed.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          7. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law, 5B Tech Support and its
          owners, operators, and affiliates shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages, including but
          not limited to loss of data, loss of profits, device damage, software
          corruption, or any other losses arising from your use of the Service or
          reliance on any content provided through the Service. Our total
          liability for any claim arising from these Terms or your use of the
          Service shall not exceed the amount you paid to us in the 12 months
          preceding the claim, or $50, whichever is less.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          8. Disclaimer of Warranties
        </h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as
          available.&rdquo; We do not warrant that the Service will be
          uninterrupted, error-free, or free of harmful components. We make no
          warranties, express or implied, including but not limited to implied
          warranties of merchantability, fitness for a particular purpose, and
          non-infringement.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">9. User Content</h2>
        <p>
          By submitting support tickets, messages, screenshots, or other
          content, you grant us a limited license to use that content solely for
          the purpose of providing support. We will not share your submitted
          content publicly.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">10. Acceptable Use</h2>
        <p>
          You agree not to: use the Service for any unlawful purpose, attempt to
          gain unauthorized access to our systems, submit false or misleading
          information in support tickets, resell or redistribute our content
          without permission, or use automated tools to scrape or copy our
          content.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          11. Intellectual Property
        </h2>
        <p>
          All content on the Service, including guides, tutorials, videos, text,
          graphics, and software, is owned by 5B Tech Support or its licensors
          and is protected by applicable intellectual property laws. You may not
          copy, reproduce, distribute, or create derivative works from our
          content without written permission.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          12. Account Deletion
        </h2>
        <p>
          You may request deletion of your account at any time through your
          Settings page. Account deletion will cancel any active subscription
          and remove your personal data in accordance with our Privacy Policy.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">
          13. Changes to Terms
        </h2>
        <p>
          We may update these Terms at any time. Material changes will be
          communicated through the Service. Continued use of the Service after
          changes take effect constitutes acceptance of the revised Terms.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">14. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of Idaho, without
          regard to conflict of law principles.
        </p>

        <h2 className="!mt-8 text-lg font-semibold">15. Contact</h2>
        <p>
          For questions about these Terms, contact us at{" "}
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
