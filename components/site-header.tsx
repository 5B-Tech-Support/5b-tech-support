import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

async function getUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function SiteHeader() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl">
      <div className="gradient-border-top" />
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight gradient-text">
          5B Tech Support
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/pricing"
            className="text-muted hover:text-foreground transition-colors"
          >
            Pricing
          </Link>

          {user ? (
            <>
              <Link
                href="/support/tickets"
                className="text-muted hover:text-foreground transition-colors"
              >
                My Tickets
              </Link>
              <Link
                href="/account"
                className="rounded-md gradient-button px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Account
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-muted hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md gradient-button px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
