import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with the basics",
    features: [
      "Limited tutorial library",
      "Email support — 3 business day response",
      "No ads, ever",
    ],
    cta: "Create free account",
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    price: "$3.99",
    period: "/month",
    description: "Full access, faster support",
    features: [
      "Full Windows tutorial library",
      "Email support — 48-hour response (business days)",
      "No ads, ever",
      "30-day free trial — no credit card",
    ],
    cta: "Start free trial",
    href: "/register/pro-trial",
    featured: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Simple, <span className="gradient-text">honest</span> pricing
        </h1>
        <p className="mt-3 text-muted">
          No hidden fees. Cancel any time. Try Pro free for 30 days.
        </p>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-8 ${
              plan.featured
                ? "border-primary/50 shadow-[0_0_30px_rgba(124,58,237,0.12)]"
                : "border-border"
            }`}
          >
            {plan.featured && (
              <>
                <div className="absolute -top-px left-8 right-8 h-0.5" style={{ background: "var(--gradient-accent)" }} />
                <span className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white gradient-button">
                  Most popular
                </span>
              </>
            )}
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="mt-1 text-sm text-muted">{plan.description}</p>
            <div className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted">{plan.period}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-primary">&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                plan.featured
                  ? "gradient-button text-white"
                  : "border border-border hover:bg-surface"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
