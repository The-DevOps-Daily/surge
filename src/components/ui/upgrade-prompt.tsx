"use client";

import React from "react";

interface UpgradePromptProps {
  message?: string;
  className?: string;
}

export function UpgradePrompt({
  message = "Upgrade to Pro to unlock this feature",
  className = "",
}: UpgradePromptProps) {
  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_pro_placeholder" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // If Stripe is not configured, go to pricing page
      window.location.href = "/pricing";
    }
  };

  return (
    <div className={`bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-6 text-center ${className}`}>
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 mb-4">
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p className="text-gray-300 mb-4">{message}</p>
      <button
        onClick={handleUpgrade}
        className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200"
      >
        Upgrade to Pro
      </button>
    </div>
  );
}
