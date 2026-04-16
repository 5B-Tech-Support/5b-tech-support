import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-32 text-center">
      <h1 className="text-4xl font-bold">Page not found.</h1>
      <p className="mt-4 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        Go Home
      </Link>
    </div>
  );
}
