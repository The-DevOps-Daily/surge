"use client";

import React from "react";

// Three variants now. Flat for embedded blocks, raised for the default
// dashboard card, interactive for clickable rows (adds a hover ring).
type Variant = "flat" | "raised" | "interactive";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  flat:
    "bg-[var(--surface-1)] border border-[var(--line-1)]",
  raised:
    "bg-[var(--surface-1)] border border-[var(--line-1)] " +
    "shadow-[var(--shadow-2)]",
  interactive:
    "bg-[var(--surface-1)] border border-[var(--line-1)] " +
    "shadow-[var(--shadow-1)] " +
    "transition-[border-color,box-shadow,background] duration-200 ease-out " +
    "hover:bg-[var(--surface-2)] hover:border-[var(--line-2)] hover:shadow-[var(--shadow-2)] " +
    "cursor-pointer focus-ring",
};

export function Card({
  children,
  className = "",
  variant = "raised",
  onClick,
  ...props
}: CardProps) {
  // Auto-promote to interactive if the caller passes onClick but didn't pick
  // a variant explicitly, so click + visual cue stay in sync.
  const resolved: Variant = onClick && variant === "raised" ? "interactive" : variant;
  return (
    <div
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      className={[
        "rounded-[20px] p-6",
        variantStyles[resolved],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-base font-semibold text-[var(--ink-3)] tracking-tight ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`mt-1 text-sm text-[var(--ink-1)] leading-relaxed ${className}`}>
      {children}
    </p>
  );
}
