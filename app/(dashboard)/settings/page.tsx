"use client";

import { useState, type FormEvent } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleProfileUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: form.get("full_name"),
      }),
    });

    if (res.ok) {
      setMessage("Profile updated.");
    } else {
      const data = await res.json();
      setError(data.error ?? "Update failed.");
    }
    setLoading(false);
  }

  async function handlePasswordChange(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirm = form.get("confirm_password") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setMessage("Password updated.");
      (e.target as HTMLFormElement).reset();
    } else {
      const data = await res.json();
      setError(data.error ?? "Update failed.");
    }
    setLoading(false);
  }

  async function handleDeleteAccount() {
    setLoading(true);
    const res = await fetch("/api/account/delete", {
      method: "POST",
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      const data = await res.json();
      setError(data.error ?? "Deletion request failed.");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold">Settings</h1>

      {message && (
        <div className="mt-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleProfileUpdate} className="mt-8 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <label className="block">
          <span className="text-sm font-medium">Display name</span>
          <input
            name="full_name"
            type="text"
            className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </label>
        <button type="submit" disabled={loading} className="btn-primary">
          Save Changes
        </button>
      </form>

      <hr className="my-10 border-border" />

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h2 className="font-semibold">Change Password</h2>
        <label className="block">
          <span className="text-sm font-medium">New password</span>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Confirm new password</span>
          <input
            name="confirm_password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </label>
        <button type="submit" disabled={loading} className="btn-primary">
          Update Password
        </button>
      </form>

      <hr className="my-10 border-border" />

      <div>
        <h2 className="font-semibold text-danger">Delete Account</h2>
        <p className="mt-2 text-sm text-muted">
          Deleting your account cancels any active subscription and removes your
          data. This cannot be undone.
        </p>
        {showDeleteConfirm ? (
          <div className="mt-4 rounded-xl border border-danger/30 bg-danger/5 p-4">
            <p className="text-sm font-medium">
              Are you sure? This action is permanent.
            </p>
            <div className="mt-3 flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white"
              >
                Yes, delete my account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="mt-4 rounded-xl border border-danger/30 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
          >
            Delete My Account
          </button>
        )}
      </div>
    </div>
  );
}
