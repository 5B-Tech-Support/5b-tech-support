"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ticket {
  id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  open: "bg-primary/10 text-primary",
  awaiting_response: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  resolved: "bg-success/10 text-success",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/support/tickets")
      .then((r) => r.json())
      .then((data) => setTickets(data.tickets ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <Link
          href="/support/tickets/new"
          className="rounded-xl gradient-button px-4 py-2 text-sm font-semibold text-white"
        >
          New ticket
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border p-8 text-center text-sm text-muted">
          <p>No tickets yet.</p>
          <p className="mt-1">
            Need help?{" "}
            <Link href="/support/tickets/new" className="text-primary hover:underline">
              Create a ticket
            </Link>{" "}
            and our team will get back to you.
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-2xl border border-border overflow-hidden">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link
                href={`/support/tickets/${ticket.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-surface transition-colors"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{ticket.title}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    Opened{" "}
                    {new Date(ticket.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`ml-4 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    statusColors[ticket.status] ?? "bg-surface text-muted"
                  }`}
                >
                  {ticket.status.replace(/_/g, " ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
