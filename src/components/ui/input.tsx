"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-400">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200 min-h-[44px] ${
          error ? "border-rose-500/50" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-400">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-gray-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200 min-h-[44px] ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0d0d14] text-gray-100">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
