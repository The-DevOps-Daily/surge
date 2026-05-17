"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
function UsersIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 21a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 21a5 5 0 0 1 6.5-4.8" />
    </svg>
  );
}
function ContentIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path d="M5 4h14v16H5z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}
function SystemIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M19 12h2M3 12h2M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </svg>
  );
}
function BackIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path d="M10 19 3 12l7-7" />
      <path d="M3 12h18" />
    </svg>
  );
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/content", label: "Content", icon: ContentIcon },
  { href: "/admin/system", label: "System", icon: SystemIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-60 bg-[var(--surface-1)] border-r border-[var(--line-1)] h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-[var(--line-1)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--warn)] text-[var(--surface-0)]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path d="M12 3 5 6v5c0 4.4 2.8 8.3 7 10 4.2-1.7 7-5.6 7-10V6l-7-3z" />
              <path d="m9 12 2 2 4-5" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-semibold text-[var(--ink-3)] tracking-tight">
                SaaS App
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-full border border-[var(--warn)] text-[var(--warn)]">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-1)]">Control plane</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
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
                    ? "bg-[var(--warn-soft)] text-[var(--warn)]"
                    : "text-[var(--ink-1)] group-hover:text-[var(--ink-3)]",
                ].join(" ")}
              >
                <Icon />
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--warn)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--line-1)] p-3">
        <Link
          href="/"
          className="group flex w-full items-center gap-3 rounded-[12px] px-3 h-9 text-sm font-medium text-[var(--ink-1)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)] transition-colors focus-ring"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[var(--ink-1)]">
            <BackIcon />
          </span>
          Back to app
        </Link>
      </div>
    </aside>
  );
}
