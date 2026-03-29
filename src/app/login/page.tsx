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
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4 relative overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl absolute -top-20 -right-20" />
      <div className="w-80 h-80 bg-teal-500/[0.08] rounded-full blur-3xl absolute -bottom-10 -left-10" />
      <div className="w-64 h-64 bg-purple-500/5 rounded-full blur-3xl absolute top-1/2 left-1/3" />

      <div className="w-full max-w-md bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 relative z-10 animate-scale-in shadow-2xl shadow-black/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 text-sm border border-rose-500/20">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">
              Forgot password?
            </Link>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
