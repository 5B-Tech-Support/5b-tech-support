import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="hero-gradient py-24 text-center text-white">
        <div className="relative z-10 mx-auto max-w-5xl px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="gradient-text">Tech help</span> that speaks
            your language
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
            Step-by-step Windows guides and friendly email support — no jargon,
            no judgment. Whether you need to fix Wi-Fi, remove a virus, or set
            up your printer, we walk you through it.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register/pro-trial"
              className="rounded-xl gradient-button px-8 py-3.5 text-base font-semibold text-white"
            >
              Start free Pro trial
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              See plans
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Find your guide",
                desc: "Browse our library of plain-English tutorials for common Windows problems.",
              },
              {
                step: "2",
                title: "Follow step by step",
                desc: "Each guide uses screenshots and simple language — no tech background needed.",
              },
              {
                step: "3",
                title: "Get personal help",
                desc: "Still stuck? Open a support ticket and our team will help you over email.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-button text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="gradient-border-top" />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="mt-3 text-muted">
            Try Pro free for 30 days — no credit card required.
          </p>
          <Link
            href="/register/pro-trial"
            className="mt-8 inline-block rounded-xl gradient-button px-8 py-3.5 text-base font-semibold text-white"
          >
            Start your free trial
          </Link>
        </div>
      </section>
    </div>
  );
}
