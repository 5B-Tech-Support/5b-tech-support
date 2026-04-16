"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#fff", color: "#1f2937" }}>
        <div style={{ maxWidth: 448, margin: "0 auto", padding: "8rem 1rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Something went wrong.</h1>
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>
            We&apos;re having a technical issue. Please try again in a few minutes.
          </p>
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                background: "#7c3aed",
                color: "#fff",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                border: "1px solid #e5e1f0",
                fontWeight: 600,
                color: "#1f2937",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
