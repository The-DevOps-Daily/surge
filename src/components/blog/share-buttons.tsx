"use client";

import { useState } from "react";

const buttonClasses =
  "inline-flex items-center justify-center h-8 w-8 rounded-[10px] " +
  "border border-[var(--line-1)] bg-[var(--surface-2)] " +
  "text-[var(--ink-2)] hover:text-[var(--ink-3)] " +
  "hover:bg-[var(--surface-3)] hover:border-[var(--line-2)] " +
  "transition-colors focus-ring";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fall through.
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium mr-1">
        Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={buttonClasses}
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      </a>
      <a
        href={`https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={buttonClasses}
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 17.34V10H6v7.34h2.34Zm-1.17-8.34a1.36 1.36 0 1 0 0-2.71 1.36 1.36 0 0 0 0 2.71ZM18 17.34V13.2c0-2.14-1.14-3.13-2.67-3.13a2.3 2.3 0 0 0-2.09 1.15V10h-2.32c.03.66 0 7.34 0 7.34h2.32v-4.1c0-.21.02-.42.08-.57.17-.42.55-.85 1.19-.85.84 0 1.17.64 1.17 1.58v3.94H18Z" />
        </svg>
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
        className={`${buttonClasses} ${copied ? "text-[var(--accent)] border-[var(--accent-ring)]" : ""}`}
      >
        {copied ? (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6.75 18 11.25M9.75 14.25l-3 3a2.121 2.121 0 0 1-3-3l4.5-4.5a2.121 2.121 0 0 1 3 0M14.25 9.75l3-3a2.121 2.121 0 0 1 3 3l-4.5 4.5a2.121 2.121 0 0 1-3 0"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
