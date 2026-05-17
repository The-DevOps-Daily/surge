"use client";

import React from "react";

// Shared field shell that the underlying input/select/textarea piggyback on.
// Keeps the height, radius, padding, focus ring, and error border in sync
// across every form control.
const fieldClasses =
  "w-full rounded-[12px] border border-[var(--line-2)] bg-[var(--surface-1)] " +
  "px-3.5 text-[var(--ink-3)] placeholder-[var(--ink-1)] " +
  "transition-colors duration-150 ease-out focus-ring " +
  "hover:border-[var(--line-3)] " +
  "focus:border-[var(--accent)] focus:bg-[var(--surface-1)] " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const errorClasses = "border-[var(--danger)] focus:border-[var(--danger)]";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = "",
  id,
  ...props
}: InputProps) {
  // Generate a stable id so the label/aria-describedby pair work even when
  // the caller doesn't supply one. The fallback id is intentionally not
  // randomised across renders to keep server/client output deterministic.
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const hintId = `${inputId}-hint`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium uppercase tracking-[0.04em] text-[var(--ink-1)]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-1)]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error || hint ? hintId : undefined}
          className={[
            fieldClasses,
            "h-11 text-sm",
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            error ? errorClasses : "",
            className,
          ].join(" ")}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-1)]">
            {rightIcon}
          </span>
        )}
      </div>
      {(error || hint) && (
        <p
          id={hintId}
          className={[
            "text-xs leading-5",
            error ? "text-[var(--danger)]" : "text-[var(--ink-1)]",
          ].join(" ")}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  hint?: string;
  error?: string;
}

export function Select({
  label,
  options,
  hint,
  error,
  className = "",
  id,
  ...props
}: SelectProps) {
  const generatedId = React.useId();
  const selectId = id || generatedId;
  const hintId = `${selectId}-hint`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium uppercase tracking-[0.04em] text-[var(--ink-1)]"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        aria-invalid={!!error}
        aria-describedby={error || hint ? hintId : undefined}
        className={[
          fieldClasses,
          "h-11 text-sm appearance-none bg-[length:16px] bg-no-repeat",
          // Chevron rendered via inline SVG so it tracks the ink color in
          // both themes without needing a separate component.
          "bg-[right_12px_center] pr-9",
          "bg-[url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")]",
          error ? errorClasses : "",
          className,
        ].join(" ")}
        {...props}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-[var(--surface-1)] text-[var(--ink-3)]"
          >
            {opt.label}
          </option>
        ))}
      </select>
      {(error || hint) && (
        <p
          id={hintId}
          className={[
            "text-xs leading-5",
            error ? "text-[var(--danger)]" : "text-[var(--ink-1)]",
          ].join(" ")}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  className = "",
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const textareaId = id || generatedId;
  const hintId = `${textareaId}-hint`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-medium uppercase tracking-[0.04em] text-[var(--ink-1)]"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error || hint ? hintId : undefined}
        className={[
          fieldClasses,
          "py-3 text-sm resize-y min-h-[88px] leading-6",
          error ? errorClasses : "",
          className,
        ].join(" ")}
        {...props}
      />
      {(error || hint) && (
        <p
          id={hintId}
          className={[
            "text-xs leading-5",
            error ? "text-[var(--danger)]" : "text-[var(--ink-1)]",
          ].join(" ")}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
