import Link from "next/link";

const steps = [
  {
    num: "1",
    title: "Search for your problem",
    desc: "Type a few words about what\u2019s wrong. Our guides are organized by topic so you can find help fast.",
  },
  {
    num: "2",
    title: "Follow the guide",
    desc: "Each guide walks you through the fix step by step, with clear instructions written for beginners.",
  },
  {
    num: "3",
    title: "Still stuck? Email us",
    desc: "Pro members can submit a support ticket and get a personal response within 48 hours.",
  },
];

const categories = [
  "Slow computer and performance issues",
  "Scam, phishing, and suspicious popup help",
  "Printer and device setup problems",
  "Wi-Fi, internet, and connection issues",
  "Email, account, and password help",
  "Storage cleanup and software updates",
  "Bluetooth and device connection issues",
  "App install and uninstall problems",
  "Browser safety and settings",
  "Finding settings and common errors",
];

const whyUs = [
  {
    title: "Written for real people",
    desc: "Every guide uses plain language. No tech jargon. No assumptions about what you already know.",
  },
  {
    title: "No ads. No sponsors. No nonsense.",
    desc: "You will never see an ad on this site. No one pays us to recommend anything. The only thing here is honest help.",
  },
  {
    title: "Consistent and organized",
    desc: "Every guide follows the same clear format. You always know where to look and what to expect.",
  },
];

const faqPreview = [
  {
    q: "What is 5B Tech Support?",
    a: "A website with step-by-step Windows guides and email support \u2014 all in plain language.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Pro comes with a 1-month free trial. No credit card needed.",
  },
  {
    q: "Do you support macOS?",
    a: "Not yet. Right now, all content is for Windows. macOS support may come in the future.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="hero-bg py-24 text-center">
        <div className="relative mx-auto max-w-3xl px-4">
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-widest gradient-text">
            Technology Made Simple
          </p>
          <h1 className="animate-fade-up stagger-1 mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Windows help that actually{" "}
            <span className="gradient-text">makes sense.</span>
          </h1>
          <p className="animate-fade-up stagger-2 mx-auto mt-5 max-w-2xl text-muted">
            5B Tech Support gives you clear, step-by-step guides for common
            Windows problems. No confusing jargon. No ads. No sponsored content.
            Just honest help, organized so you can find exactly what you need.
          </p>
          <div className="animate-fade-up stagger-3 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/help-center" className="btn-primary px-8 py-3.5 text-base">
              Explore Help Center
            </Link>
            <Link href="/plans" className="btn-secondary px-8 py-3.5 text-base">
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest gradient-text">
            How It Works
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
            Get help in three simple steps.
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className={`glass-strong rounded-2xl p-6 text-center card-hover animate-fade-up stagger-${i + 1}`}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  {s.num}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we help with */}
      <section className="hero-bg py-20">
        <div className="relative mx-auto max-w-5xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest gradient-text">
            Common Topics
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
            Find your issue quickly.
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Link
                key={cat}
                href="/help-center"
                className={`glass rounded-xl p-5 text-sm font-medium card-hover animate-fade-up stagger-${(i % 5) + 1}`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest gradient-text">
            Why 5B Tech Support
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
            A calmer alternative to confusing tech advice.
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {whyUs.map((item, i) => (
              <div
                key={item.title}
                className={`glass-strong rounded-2xl p-6 card-hover animate-fade-up stagger-${i + 1}`}
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan preview */}
      <section className="hero-bg py-20">
        <div className="relative mx-auto max-w-5xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest gradient-text">
            Plans
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
            Simple and affordable.
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
            <div className="glass-strong rounded-2xl p-6 card-hover">
              <h3 className="text-xl font-semibold">Free</h3>
              <p className="mt-1 text-3xl font-bold">
                $0<span className="text-base font-normal text-muted">/month</span>
              </p>
              <p className="mt-3 text-sm text-muted">
                3 tutorials per month, email support with 3 business day response.
              </p>
              <Link href="/register" className="btn-secondary mt-6 w-full !text-sm">
                Create Free Account
              </Link>
            </div>
            <div className="glass-strong rounded-2xl p-6 card-hover animate-glow-pulse"
              style={{ borderColor: "var(--primary)" }}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">Pro</h3>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary"
                  style={{ background: "rgba(124, 58, 237, 0.1)" }}
                >
                  Free trial
                </span>
              </div>
              <p className="mt-1 text-3xl font-bold">
                $3.99<span className="text-base font-normal text-muted">/month</span>
              </p>
              <p className="mt-3 text-sm text-muted">
                Unlimited tutorials, 48-hour email support. 1-month free trial, no
                credit card needed.
              </p>
              <Link href="/register/pro-trial" className="btn-primary mt-6 w-full !text-sm">
                Start Free Trial
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/plans" className="text-primary hover:underline">
              Compare plans in detail &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-10 space-y-4">
            {faqPreview.map((item) => (
              <div key={item.q} className="glass rounded-xl p-5 card-hover">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-1 text-sm text-muted">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            <Link href="/faq" className="text-primary hover:underline">
              View all 20 questions &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="gradient-border-top mb-6" />
          <p className="disclaimer text-center">
            All content is for educational purposes only. Follow instructions at
            your own risk. See our{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
