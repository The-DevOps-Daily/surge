"use client";

import React from "react";
import Link from "next/link";
import { PLANS } from "@/lib/pricing";

interface UpgradePromptProps {
  message?: string;
  features?: string[];
  className?: string;
}

export function UpgradePrompt({
  message = "Upgrade to Pro to unlock this feature",
  features,
  className = "",
}: UpgradePromptProps) {
  return (
    <div className={`bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-8 text-center max-w-lg mx-auto ${className}`}>
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-500/10 mb-5">
        <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-100 mb-2">Pro Feature</h3>
      <p className="text-sm text-gray-400 mb-5 leading-relaxed">{message}</p>

      {features && features.length > 0 && (
        <ul className="text-left space-y-2.5 mb-6 max-w-xs mx-auto">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
              <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/billing?plan=pro"
        className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200"
      >
        Upgrade to Pro - {PLANS.pro.price}/mo
      </Link>
      <p className="text-xs text-gray-600 mt-3">Cancel anytime. No lock-in.</p>
    </div>
  );
}
