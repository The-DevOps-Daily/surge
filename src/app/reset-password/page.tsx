"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setDone(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-[var(--ink-1)]">
          Invalid reset link. Please request a new one.
        </p>
        <Link href="/forgot-password">
          <Button variant="primary" size="lg" className="w-full">
            Request reset link
          </Button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-5">
        <div
          role="status"
          className="rounded-[14px] border border-[var(--line-2)] bg-[var(--accent-soft)] p-5 text-center"
        >
          <svg
            className="w-8 h-8 text-[var(--accent)] mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
          </svg>
          <p className="text-sm font-medium text-[var(--ink-3)]">
            Password reset
          </p>
          <p className="text-sm text-[var(--ink-1)] mt-1 leading-relaxed">
            You can now sign in with your new password.
          </p>
        </div>
        <Link href="/login">
          <Button variant="primary" className="w-full" size="lg">
            Sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-[10px] border border-[var(--line-2)] bg-[var(--danger-soft)] text-[var(--danger)] text-sm px-3 py-2.5"
        >
          {error}
        </div>
      )}
      <Input
        label="New password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
      />
      <Input
        label="Confirm password"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Re-enter password"
        autoComplete="new-password"
        required
      />
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        size="lg"
        loading={loading}
      >
        {loading ? "Resetting..." : "Reset password"}
      </Button>
      <p className="text-center text-sm text-[var(--ink-1)]">
        <Link
          href="/login"
          className="text-[var(--ink-3)] hover:text-[var(--accent)] font-medium transition-colors"
        >
          ← Back to sign in
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-0)] p-4 relative overflow-hidden">
      <div className="bg-mesh" />

      <div className="w-full max-w-[420px] rounded-[24px] border border-[var(--line-1)] bg-[var(--surface-1)] p-8 relative z-10 animate-scale-in shadow-[var(--shadow-3)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--surface-2)] mb-5">
            <svg
              className="w-5 h-5 text-[var(--ink-2)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
            Reset password
          </h1>
          <p className="text-sm text-[var(--ink-1)] mt-1.5">
            Pick a new password for your account.
          </p>
        </div>

        <Suspense fallback={<p className="text-center text-[var(--ink-1)]">Loading...</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
