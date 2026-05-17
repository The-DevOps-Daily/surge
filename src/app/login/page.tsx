"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-0)] p-4 relative overflow-hidden">
      <div className="bg-mesh" />

      <div className="w-full max-w-[420px] rounded-[24px] border border-[var(--line-1)] bg-[var(--surface-1)] p-8 relative z-10 animate-scale-in shadow-[var(--shadow-3)]">
        <div className="text-center mb-8">
          {/* Solid mark replaces the previous rocket emoji + glow surface. */}
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--ink-3)] text-[var(--surface-0)] mb-5">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2 2 22h20L12 2z" />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--ink-1)] mt-1.5">
            Sign in to your account
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
            placeholder="Your password"
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            loading={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-[var(--ink-1)] hover:text-[var(--ink-3)] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--line-1)]" />
          <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)]">
            New here?
          </span>
          <div className="flex-1 h-px bg-[var(--line-1)]" />
        </div>

        <Link
          href="/register"
          className="block w-full text-center h-11 rounded-[12px] border border-[var(--line-2)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-sm font-medium text-[var(--ink-3)] leading-[44px] transition-colors focus-ring"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
