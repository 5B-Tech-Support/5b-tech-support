import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Tech help that speaks your language
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Step-by-step Windows guides and friendly email support — no jargon, no
          judgment. Whether you need to fix Wi-Fi, remove a virus, or set up
          your printer, we walk you through it.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/register/pro-trial"
            className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            Start free Pro trial
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-border px-6 py-3 text-base font-medium hover:bg-surface transition-colors"
          >
            See plans
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold">How it works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                1
              </div>
              <h3 className="mt-4 font-semibold">Find your guide</h3>
              <p className="mt-2 text-sm text-muted">
                Browse our library of plain-English tutorials for common Windows
                problems.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                2
              </div>
              <h3 className="mt-4 font-semibold">Follow step by step</h3>
              <p className="mt-2 text-sm text-muted">
                Each guide uses screenshots and simple language — no tech
                background needed.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                3
              </div>
              <h3 className="mt-4 font-semibold">Get personal help</h3>
              <p className="mt-2 text-sm text-muted">
                Still stuck? Open a support ticket and our team will help you
                over email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold">Ready to get started?</h2>
        <p className="mt-2 text-muted">
          Try Pro free for 30 days — no credit card required.
        </p>
        <Link
          href="/register/pro-trial"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
        >
          Start your free trial
        </Link>
      </section>
    </div>
  );
}
