"use client";

import { useEffect, useState } from "react";

interface StatusItem {
  name: string;
  status: "operational" | "degraded" | "down" | "unknown";
}

export default function StatusPage() {
  const [services, setServices] = useState<StatusItem[]>([
    { name: "Website", status: "unknown" },
    { name: "Authentication", status: "unknown" },
    { name: "API", status: "unknown" },
    { name: "Support Tickets", status: "unknown" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          setServices([
            { name: "Website", status: "operational" },
            { name: "Authentication", status: "operational" },
            { name: "API", status: "operational" },
            { name: "Support Tickets", status: "operational" },
          ]);
        } else {
          setServices((prev) =>
            prev.map((s) => ({ ...s, status: "degraded" as const }))
          );
        }
      } catch {
        setServices((prev) =>
          prev.map((s) => ({ ...s, status: "down" as const }))
        );
      }
      setLoading(false);
    }

    checkStatus();
  }, []);

  const allOperational = services.every((s) => s.status === "operational");

  const statusColor = {
    operational: "bg-success",
    degraded: "bg-yellow-500",
    down: "bg-danger",
    unknown: "bg-muted/40",
  };

  const statusLabel = {
    operational: "Operational",
    degraded: "Degraded",
    down: "Down",
    unknown: "Checking...",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold">System Status</h1>

      {!loading && (
        <div
          className={`mt-6 rounded-xl p-4 text-sm font-medium ${
            allOperational
              ? "bg-success/10 text-success"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {allOperational
            ? "All systems operational."
            : "Some systems may be experiencing issues."}
        </div>
      )}

      <div className="mt-8 divide-y divide-border rounded-xl border border-border overflow-hidden">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between px-5 py-4"
          >
            <span className="font-medium">{service.name}</span>
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${statusColor[service.status]}`}
              />
              <span className="text-sm text-muted">
                {statusLabel[service.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
