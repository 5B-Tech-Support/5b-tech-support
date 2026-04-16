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
    <header className="glass-strong sticky top-0 z-40 rounded-b-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-baseline gap-1.5 group">
          <span className="text-xl font-extrabold gradient-text transition-transform duration-300 group-hover:scale-105">
            5B
          </span>
          <span className="font-mono text-xs font-medium tracking-wider text-muted">
            TECH SUPPORT
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className="text-muted hover:text-primary transition-colors duration-200">
                Dashboard
              </Link>
              <Link href="/help-center" className="text-muted hover:text-primary transition-colors duration-200">
                Help Center
              </Link>
              <Link href="/saved-guides" className="text-muted hover:text-primary transition-colors duration-200">
                Saved Guides
              </Link>
              <Link href="/support/tickets" className="text-muted hover:text-primary transition-colors duration-200">
                Tickets
              </Link>
              <Link href="/billing" className="text-muted hover:text-primary transition-colors duration-200">
                Billing
              </Link>
              <Link href="/settings" className="text-muted hover:text-primary transition-colors duration-200">
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="text-muted hover:text-primary transition-colors duration-200">
                Home
              </Link>
              <Link href="/help-center" className="text-muted hover:text-primary transition-colors duration-200">
                Help Center
              </Link>
              <Link href="/plans" className="text-muted hover:text-primary transition-colors duration-200">
                Plans
              </Link>
              <Link href="/faq" className="text-muted hover:text-primary transition-colors duration-200">
                FAQ
              </Link>
              <Link href="/register" className="btn-primary !py-2 !px-4 !text-sm">
                Create Account
              </Link>
              <Link href="/login" className="text-muted hover:text-primary transition-colors duration-200 font-medium">
                Log In
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
