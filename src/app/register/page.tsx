"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-0)] p-4 relative overflow-hidden">
      <div className="bg-mesh" />

      <div className="w-full max-w-[420px] rounded-[24px] border border-[var(--line-1)] bg-[var(--surface-1)] p-8 relative z-10 animate-scale-in shadow-[var(--shadow-3)]">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--ink-3)] text-[var(--surface-0)] mb-5"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2 2 22h20L12 2z" />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
            Create your account
          </h1>
          <p className="text-sm text-[var(--ink-1)] mt-1.5">
            Free to start, no card required.
          </p>
        </div>

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
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            hint="Use 8 or more characters with a mix of letters, numbers, and symbols."
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            loading={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--ink-1)] mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--ink-3)] hover:text-[var(--accent)] font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
