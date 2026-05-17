"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface DocLink {
  slug: string;
  title: string;
  description: string;
}

interface DocsSidebarProps {
  docs: DocLink[];
}

export function DocsSidebar({ docs }: DocsSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (slug: string) => pathname === `/docs/${slug}`;
  const isIndex = pathname === "/docs";

  return (
    <>
      {/* Mobile trigger — visible below the breakpoint where the desktop
       * sidebar collapses. */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-[10px] border border-[var(--line-1)] bg-[var(--surface-1)] text-sm text-[var(--ink-2)] hover:bg-[var(--surface-2)] focus-ring"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          {mobileOpen ? "Hide docs" : "Browse docs"}
        </button>
      </div>

      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } lg:block lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto pb-6`}
        aria-label="Docs navigation"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--ink-1)] px-3 mb-2">
          Docs
        </p>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/docs"
              onClick={() => setMobileOpen(false)}
              className={`block rounded-[10px] px-3 py-1.5 text-sm transition-colors focus-ring ${
                isIndex
                  ? "bg-[var(--surface-2)] text-[var(--ink-3)] font-medium"
                  : "text-[var(--ink-1)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)]"
              }`}
            >
              Overview
            </Link>
          </li>
          {docs.map((doc) => (
            <li key={doc.slug}>
              <Link
                href={`/docs/${doc.slug}`}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-[10px] px-3 py-1.5 text-sm transition-colors focus-ring ${
                  isActive(doc.slug)
                    ? "bg-[var(--surface-2)] text-[var(--ink-3)] font-medium"
                    : "text-[var(--ink-1)] hover:text-[var(--ink-3)] hover:bg-[var(--surface-2)]"
                }`}
              >
                {doc.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-4 border-t border-[var(--line-1)] px-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--ink-1)] mb-2">
            Resources
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>
              <a
                href="https://github.com/The-DevOps-Daily/surge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--ink-1)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5"
              >
                GitHub
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H18v4.5M17.5 6.5 10 14M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
                  />
                </svg>
              </a>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-[var(--ink-1)] hover:text-[var(--accent)] transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <a
                href="/api/openapi.json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--ink-1)] hover:text-[var(--accent)] transition-colors"
              >
                API spec
              </a>
            </li>
            <li>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--ink-1)] hover:text-[var(--accent)] transition-colors"
              >
                llms.txt
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
