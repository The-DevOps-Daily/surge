"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Inline SVG icons keep the chrome consistent across desktop / mobile / admin
// and avoid the emoji-rendering inconsistency between OSes (the old version
// shipped 📊 / 🧾 / ⚙️ which look very different on macOS vs Windows).
function DashboardIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}
function BillingIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h3" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path d="M12 3 5 6v5c0 4.4 2.8 8.3 7 10 4.2-1.7 7-5.6 7-10V6l-7-3z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}
function SignOutIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  // Add your nav items here:
  // { href: "/your-page", label: "Your Page", icon: YourIcon },
  { href: "/billing", label: "Billing", icon: BillingIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <aside className="hidden md:flex md:flex-col md:w-60 bg-[var(--surface-1)] border-r border-[var(--line-1)] h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[var(--line-1)]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--ink-3)] text-[var(--surface-0)] shadow-[var(--shadow-1)]">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2 2 22h20L12 2z" />
            </svg>
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold text-[var(--ink-3)] tracking-tight">
              SaaS App
            </h1>
            <p className="text-[11px] text-[var(--ink-1)]">Your tagline</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex items-center gap-3 rounded-[12px] px-3 h-9 text-sm font-medium",
                "transition-colors duration-150 ease-out focus-ring",
                isActive
                  ? "bg-[var(--surface-2)] text-[var(--ink-3)]"
                  : "text-[var(--ink-1)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)]",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] transition-colors",
                  isActive
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--ink-1)] group-hover:text-[var(--ink-3)]",
                ].join(" ")}
              >
                <Icon />
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Foot */}
      <div className="border-t border-[var(--line-1)] p-3 space-y-1">
        {isAdmin && (
          <Link
            href="/admin"
            className="group flex items-center gap-3 rounded-[12px] px-3 h-9 text-sm font-medium text-[var(--ink-1)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)] transition-colors focus-ring"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[var(--ink-1)] group-hover:text-[var(--warn)]">
              <ShieldIcon />
            </span>
            Admin
          </Link>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group flex w-full items-center gap-3 rounded-[12px] px-3 h-9 text-sm font-medium text-[var(--ink-1)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)] transition-colors focus-ring"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[var(--ink-1)] group-hover:text-[var(--danger)]">
            <SignOutIcon />
          </span>
          Sign out
        </button>
        <div className="flex items-center justify-between rounded-[12px] px-3 pt-1">
          <span className="text-[11px] uppercase tracking-[0.04em] text-[var(--ink-1)]">
            Theme
          </span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
