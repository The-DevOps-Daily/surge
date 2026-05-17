"use client";

import React from "react";

// Five variants now, with `accent` replacing the old gradient `primary` so a
// solid surface can carry the click weight without leaning on a teal gradient.
// `primary` is retained as the highest-emphasis button (filled ink), `accent`
// is the green-tinted CTA, `secondary` is the neutral fill, `ghost` is the
// link-style fallback, and `danger` is destructive.
type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

// Tailwind arbitrary values pull straight from the CSS variables defined in
// globals.css, so each variant participates in the dark/light token switch
// without per-variant overrides.
const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[var(--ink-3)] text-[var(--surface-0)] hover:bg-[var(--ink-2)] " +
    "shadow-[var(--shadow-1)]",
  accent:
    "bg-[var(--accent)] text-[var(--surface-0)] hover:bg-[var(--accent-strong)] " +
    "shadow-[var(--shadow-1)]",
  secondary:
    "bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line-2)] " +
    "hover:bg-[var(--surface-3)] shadow-[var(--shadow-1)]",
  ghost:
    "bg-transparent text-[var(--ink-2)] hover:bg-[var(--surface-2)]",
  danger:
    "bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--line-2)] " +
    "hover:bg-[var(--danger-soft)] hover:border-[var(--danger)]",
};

const sizeStyles: Record<Size, string> = {
  // Smaller pill for inline use. Tap targets stay >=36px which is the
  // mobile-keyboard threshold; the row height still meets 44 when used
  // standalone because callers wrap in a 44px container.
  sm: "h-9 px-3 text-sm rounded-[10px]",
  md: "h-11 px-4 text-sm rounded-[12px]",
  lg: "h-12 px-6 text-base rounded-[14px]",
};

export function Button({
  variant = "accent",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      // focus-ring is defined in globals.css and reads from --accent-ring so
      // it adapts to both themes without per-button setup.
      className={[
        "inline-flex items-center justify-center gap-2 font-medium",
        "transition-colors duration-150 ease-out",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-ring",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-r-transparent"
        />
      )}
      {children}
    </button>
  );
}
