"use client";

import React, { useCallback, useRef } from "react";

interface CurrencyInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  currency?: string;
}

function formatWithCommas(value: string): string {
  const num = value.replace(/[^0-9.]/g, "");
  if (!num) return "";

  const parts = num.split(".");
  const integer = parts[0];
  const decimal = parts[1];

  const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal !== undefined ? `${formatted}.${decimal}` : formatted;
}

function stripCommas(value: string): string {
  return value.replace(/,/g, "");
}

export function CurrencyInput({
  label,
  value,
  onChange,
  placeholder = "0",
  currency = "$",
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = formatWithCommas(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const rawBefore = stripCommas(displayValue);
      const rawAfter = stripCommas(input.value);

      // Cap at 999,999,999,999 (under 1 trillion)
      if (rawAfter === "" || /^\d*\.?\d*$/.test(rawAfter)) {
        const num = parseFloat(rawAfter);
        if (num > 999999999999) return;
        onChange(rawAfter);

        // Restore cursor position accounting for added/removed commas
        requestAnimationFrame(() => {
          if (!inputRef.current) return;
          const cursorPos = input.selectionStart || 0;
          const newFormatted = formatWithCommas(rawAfter);
          const commasBefore = (input.value.slice(0, cursorPos).match(/,/g) || []).length;
          const commasAfter = (newFormatted.slice(0, cursorPos + (newFormatted.length - input.value.length)).match(/,/g) || []).length;
          const newPos = cursorPos + (commasAfter - commasBefore);
          inputRef.current.setSelectionRange(newPos, newPos);
        });
      }
    },
    [onChange, displayValue]
  );

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium uppercase tracking-[0.04em] text-[var(--ink-1)]">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-1)] text-sm pointer-events-none">
          {currency}
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-[12px] border border-[var(--line-2)] bg-[var(--surface-1)] pl-8 pr-4 h-11 text-[var(--ink-3)] placeholder-[var(--ink-1)] focus:border-[var(--accent)] focus-ring transition-colors duration-150 ease-out font-mono text-lg"
        />
      </div>
    </div>
  );
}
