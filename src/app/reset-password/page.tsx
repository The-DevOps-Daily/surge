"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4 relative overflow-hidden">
      <div className="w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl absolute -top-20 -right-20" />
      <div className="w-80 h-80 bg-teal-500/[0.08] rounded-full blur-3xl absolute -bottom-10 -left-10" />

      <div className="w-full max-w-md bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 relative z-10 animate-scale-in shadow-2xl shadow-black/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.67-5.67a8 8 0 1111.34 0l-5.67 5.67z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Password reset is not yet available
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
          <p className="text-sm text-amber-300">
            Password reset via email is not yet configured. Please contact support for assistance with resetting your password.
          </p>
        </div>

        <Link href="/login">
          <Button className="w-full" size="lg">
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
