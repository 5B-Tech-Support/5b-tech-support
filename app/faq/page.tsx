import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  {
    q: "What is 5B Tech Support?",
    a: "5B Tech Support is a website that helps you solve common Windows computer problems. It has step-by-step guides, tutorials, and email support \u2014 all written in plain language for people who aren\u2019t tech experts.",
  },
  {
    q: "Who is 5B Tech Support for?",
    a: "Anyone who wants simple, clear help with their Windows computer. It\u2019s especially helpful for people who find most tech advice confusing or overwhelming.",
  },
  {
    q: "What kinds of problems can you help with?",
    a: "Common software and settings issues like: slow computers, Wi-Fi problems, email and password help, printer setup, suspicious popups and scams, storage cleanup, software updates, Bluetooth issues, browser problems, and finding settings.",
  },
  {
    q: "Do you help with hardware repair?",
    a: "No. 5B Tech Support focuses on software, settings, and everyday computer use. We don\u2019t offer hardware repair.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. You need a free account to use the site. Creating an account takes less than a minute.",
  },
  {
    q: "What does the Free plan include?",
    a: "The Free plan gives you access to a limited selection of guides and tutorials, email support with a 3 business day response time, and the ability to save guides. There are no ads on any plan.",
  },
  {
    q: "What does the Pro plan include?",
    a: "Pro gives you the full tutorial library, email support with a 48-hour response time on business days, and everything in the Free plan. Pro costs $3.99 per month.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Pro comes with a 1-month free trial. No credit card is needed to start. When the trial ends, it does not charge you automatically. You choose whether to subscribe.",
  },
  {
    q: "What happens when my free trial ends?",
    a: "Your account switches back to the Free plan. You keep your account and saved guides, but you lose access to Pro-only content until you subscribe.",
  },
  {
    q: "How does email support work?",
    a: "If you need help beyond what the guides cover, you can submit a support ticket through your account. You describe your problem, and we respond with written instructions, screenshots, or short screen recordings.",
  },
  {
    q: "How fast will I get a response?",
    a: "Free plan: within 3 business days. Pro plan: within 48 hours on business days. These are goals, not guarantees \u2014 but we aim to be faster whenever possible.",
  },
  {
    q: "Can I attach screenshots to a support ticket?",
    a: "Yes. You can upload up to 3 images to help show what you\u2019re seeing on your screen.",
  },
  {
    q: "Do you support macOS?",
    a: "Not yet. Right now, all content is for Windows. macOS support may come in the future.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your Pro subscription anytime from your Billing page. Your Pro access stays active until the end of your current billing period.",
  },
  {
    q: "Do you offer refunds?",
    a: "No. Since you can try Pro free for a month and cancel anytime, we do not offer refunds.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes. You can request account deletion from your Settings page. Deleting your account cancels any active subscription.",
  },
  {
    q: "Is my data safe?",
    a: "We collect only what\u2019s needed to run your account. Payments are processed by Stripe. We do not sell your information. See our Privacy Policy for details.",
  },
  {
    q: "Why should I use this instead of YouTube?",
    a: "YouTube has millions of tech videos, but they\u2019re all different \u2014 different styles, different versions, different quality. Many are outdated or full of sponsor ads. 5B Tech Support has one consistent format, all written for the same audience, organized so you can search by keyword and find the right answer for your exact situation.",
  },
  {
    q: "What if a guide doesn\u2019t fix my problem?",
    a: "If you\u2019re on the Pro plan, submit a support ticket and we\u2019ll help you directly. If you\u2019re on the Free plan, you can try other related guides or upgrade to Pro for personal support.",
  },
  {
    q: "Is this site safe to use?",
    a: "Yes. We do not install anything on your computer. Our guides only walk you through settings and steps that are already built into Windows. We never ask you to download unknown software.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold sm:text-4xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-3 text-muted">
        Everything you need to know about 5B Tech Support.
      </p>

      <div className="mt-12 divide-y divide-border">
        {faqs.map((faq, i) => (
          <details key={i} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              {faq.q}
              <span className="ml-4 shrink-0 text-muted transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
