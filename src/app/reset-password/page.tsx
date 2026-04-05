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
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-4">Invalid reset link. Please request a new one.</p>
        <Link href="/forgot-password">
          <Button size="lg">Request Reset Link</Button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <svg className="w-10 h-10 text-emerald-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-emerald-300 font-medium">Password reset successfully!</p>
          <p className="text-sm text-gray-400 mt-1">You can now sign in with your new password.</p>
        </div>
        <Link href="/login">
          <Button className="w-full" size="lg">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-300">
          {error}
        </div>
      )}
      <Input
        label="New password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Min 8 characters"
        required
      />
      <Input
        label="Confirm password"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Re-enter password"
        required
      />
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
      <p className="text-center text-sm text-gray-500">
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
          Back to login
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4 relative overflow-hidden">
      <div className="w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl absolute -top-20 -right-20" />
      <div className="w-80 h-80 bg-teal-500/[0.08] rounded-full blur-3xl absolute -bottom-10 -left-10" />

      <div className="w-full max-w-md bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 relative z-10 animate-scale-in shadow-2xl shadow-black/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your new password
          </p>
        </div>

        <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
