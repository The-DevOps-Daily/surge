"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface StatProps {
  label: string;
  value: string;
  delta?: string;
  icon: React.ReactNode;
}

function Stat({ label, value, delta, icon }: StatProps) {
  return (
    <div className="rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6">
      <div className="flex items-start justify-between mb-5">
        <span className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
          {label}
        </span>
        <div className="w-8 h-8 rounded-[10px] bg-[var(--surface-2)] border border-[var(--line-1)] flex items-center justify-center text-[var(--ink-1)]">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-semibold tracking-[-0.02em] text-[var(--ink-3)] tabular-nums">
        {value}
      </p>
      {delta && (
        <p className="text-xs text-[var(--ink-1)] mt-2">{delta}</p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [tier, setTier] = useState<string>("free");
  const [upgradeDismissed, setUpgradeDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/user/tier")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.tier) setTier(data.tier);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {tier === "free" && !upgradeDismissed && (
        <div
          role="region"
          aria-label="Upgrade prompt"
          className="flex items-center gap-4 rounded-[16px] border border-[var(--line-1)] bg-[var(--surface-1)] px-5 py-4 shadow-[var(--shadow-1)]"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-[12px] bg-[var(--accent-soft)] flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[var(--accent)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 3v4m-2-2h4m11 9v4m-2-2h4M9 3l2.39 5.61L17 11l-5.61 2.39L9 19l-2.39-5.61L1 11l5.61-2.39L9 3z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--ink-3)]">
              Unlock Pro features
            </p>
            <p className="text-xs text-[var(--ink-1)] mt-0.5">
              Get unlimited access, advanced features, and priority support.
            </p>
          </div>
          <Link
            href="/billing?plan=pro"
            className="flex-shrink-0 inline-flex items-center justify-center h-9 px-4 text-xs font-medium rounded-[10px] bg-[var(--ink-3)] text-[var(--surface-0)] hover:opacity-90 transition-opacity focus-ring"
          >
            Upgrade
          </Link>
          <button
            onClick={() => setUpgradeDismissed(true)}
            aria-label="Dismiss"
            className="flex-shrink-0 w-8 h-8 rounded-[10px] text-[var(--ink-1)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)] transition-colors focus-ring flex items-center justify-center"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-[var(--ink-1)] mt-1.5">
          Here&apos;s what&apos;s happening in your account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Stat
          label="Widget 1"
          value="--"
          delta="Awaiting data"
          icon={
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
                d="M3 12h4l3-9 4 18 3-9h4"
              />
            </svg>
          }
        />
        <Stat
          label="Widget 2"
          value="--"
          delta="Awaiting data"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <rect x="3" y="11" width="4" height="9" rx="1" />
              <rect x="10" y="6" width="4" height="14" rx="1" />
              <rect x="17" y="14" width="4" height="6" rx="1" />
            </svg>
          }
        />
        <Stat
          label="Widget 3"
          value="--"
          delta="Awaiting data"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          }
        />
      </div>

      <div className="rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-12 text-center">
        <div className="w-12 h-12 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line-1)] mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[var(--ink-1)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-[var(--ink-3)] mb-1.5">
          This is your dashboard
        </h2>
        <p className="text-sm text-[var(--ink-1)] max-w-md mx-auto">
          Replace these widgets with whatever your product actually shows. The
          shell, theme, and primitives are ready to go.
        </p>
      </div>
    </div>
  );
}
