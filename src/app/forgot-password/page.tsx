"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // We intentionally swallow errors here: the server always returns 200
      // to avoid leaking whether an account exists for the address.
    }
    setLoading(false);
    setSubmitted(true);
  };

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
            Forgot password?
          </h1>
          <p className="text-sm text-[var(--ink-1)] mt-1.5">
            Enter your email and we'll send a reset link.
          </p>
        </div>

        {submitted ? (
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
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <p className="text-sm font-medium text-[var(--ink-3)]">
                Check your email
              </p>
              <p className="text-sm text-[var(--ink-1)] mt-1 leading-relaxed">
                If an account exists with that email, a reset link is on its way.
              </p>
            </div>
            <Link
              href="/login"
              className="block text-center text-sm text-[var(--ink-2)] hover:text-[var(--ink-3)] transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              loading={loading}
            >
              {loading ? "Sending..." : "Send reset link"}
            </Button>
            <p className="text-center text-sm text-[var(--ink-1)]">
              Remembered it?{" "}
              <Link
                href="/login"
                className="text-[var(--ink-3)] hover:text-[var(--accent)] font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
