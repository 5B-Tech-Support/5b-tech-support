"use client";

interface ViewToggleProps {
  view: "list" | "grid";
  onChange: (view: "list" | "grid") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="glass flex items-center gap-1 rounded-lg p-0.5">
      <button
        onClick={() => onChange("list")}
        className={`rounded-md p-1.5 transition-all duration-200 ${
          view === "list"
            ? "text-white"
            : "text-muted hover:text-foreground"
        }`}
        style={view === "list" ? { background: "var(--accent-gradient)" } : undefined}
        aria-label="List view"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="3" y1="4.5" x2="15" y2="4.5" />
          <line x1="3" y1="9" x2="15" y2="9" />
          <line x1="3" y1="13.5" x2="15" y2="13.5" />
        </svg>
      </button>
      <button
        onClick={() => onChange("grid")}
        className={`rounded-md p-1.5 transition-all duration-200 ${
          view === "grid"
            ? "text-white"
            : "text-muted hover:text-foreground"
        }`}
        style={view === "grid" ? { background: "var(--accent-gradient)" } : undefined}
        aria-label="Grid view"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="5.5" height="5.5" rx="1" />
          <rect x="10.5" y="2" width="5.5" height="5.5" rx="1" />
          <rect x="2" y="10.5" width="5.5" height="5.5" rx="1" />
          <rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1" />
        </svg>
      </button>
    </div>
  );
}
