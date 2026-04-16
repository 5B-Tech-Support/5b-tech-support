"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Message {
  id: string;
  sender_role: "user" | "agent" | "system";
  body: string;
  created_at: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  os_type: string | null;
  issue_category: string | null;
  created_at: string;
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyBody, setReplyBody] = useState("");

  useEffect(() => {
    fetch(`/api/support/tickets/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTicket(data.ticket);
        setMessages(data.messages ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleReply(e: FormEvent) {
    e.preventDefault();
    if (!replyBody.trim()) return;
    setSending(true);

    const res = await fetch(`/api/support/tickets/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: replyBody }),
    });

    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      setReplyBody("");
    }
    setSending(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-muted">Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-danger">Ticket not found.</p>
        <Link href="/support/tickets" className="mt-2 text-sm text-primary hover:underline">
          Back to tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/support/tickets"
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        &larr; All tickets
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold">{ticket.title}</h1>
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted">
          <span className="capitalize">{ticket.status.replace(/_/g, " ")}</span>
          {ticket.os_type && <span>{ticket.os_type}</span>}
          {ticket.issue_category && <span>{ticket.issue_category}</span>}
          <span>
            Opened{" "}
            {new Date(ticket.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border p-5">
        <p className="whitespace-pre-wrap text-sm">{ticket.description}</p>
      </div>

      {messages.length > 0 && (
        <div className="mt-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-4 ${
                msg.sender_role === "agent"
                  ? "border-primary/30 bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="font-medium capitalize">
                  {msg.sender_role === "agent" ? "Support team" : "You"}
                </span>
                <span>
                  {new Date(msg.created_at).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{msg.body}</p>
            </div>
          ))}
        </div>
      )}

      {ticket.status !== "resolved" && (
        <form onSubmit={handleReply} className="mt-6">
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            rows={4}
            required
            placeholder="Write a reply..."
            className="block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={sending || !replyBody.trim()}
            className="btn-primary mt-3"
          >
            {sending ? "Sending..." : "Send Reply"}
          </button>
        </form>
      )}
    </div>
  );
}
