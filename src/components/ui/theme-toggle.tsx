"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const buttonClasses =
  "inline-flex h-9 w-9 items-center justify-center rounded-[10px] " +
  "text-[var(--ink-1)] transition-colors duration-150 ease-out " +
  "hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)] focus-ring";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Render a placeholder while next-themes is hydrating, sized the same as
  // the real button so we never cause layout shift between SSR and CSR.
  if (!mounted) {
    return <button aria-hidden className={buttonClasses + " opacity-0 pointer-events-none"} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={buttonClasses}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        // Sun: hover tints amber, intentional restraint on the accent.
        <svg
          className="w-4 h-4 transition-colors duration-150 hover:text-[var(--warn)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 3v2M12 19v2M5 12H3M21 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 15A9.75 9.75 0 1 1 9 2.25a7.5 7.5 0 0 0 12.75 12.75Z"
          />
        </svg>
      )}
    </button>
  );
}
