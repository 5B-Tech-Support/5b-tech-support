import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="glass mt-12 rounded-t-2xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} 5B Tech Support. All rights reserved.
        </p>
        <nav className="flex gap-6 text-sm text-muted">
          <Link href="/terms" className="hover:text-primary transition-colors duration-200">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-primary transition-colors duration-200">
            Privacy Policy
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors duration-200">
            Contact
          </Link>
          <Link href="/faq" className="hover:text-primary transition-colors duration-200">
            FAQ
          </Link>
        </nav>
      </div>
    </footer>
  );
}
