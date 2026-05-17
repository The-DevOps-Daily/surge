"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Match the desktop sidebar icon set so mobile and desktop navigation feel
// like the same product, not two different ones.
function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 1.8 : 1.6}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}
function BillingIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 1.8 : 1.6}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 1.8 : 1.6}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.4 1A7 7 0 0 0 14.5 5L14 2.5h-4L9.5 5a7 7 0 0 0-2 1l-2.4-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 2 1L10 21.5h4l.5-2.5a7 7 0 0 0 2-1l2.4 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" />
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

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--line-1)] bg-[var(--surface-1)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around py-1.5 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex flex-col items-center gap-0.5 px-3 py-2 min-w-[56px] min-h-[44px] rounded-[12px]",
                "transition-colors duration-150 ease-out focus-ring",
                isActive
                  ? "text-[var(--ink-3)]"
                  : "text-[var(--ink-1)] hover:text-[var(--ink-3)] active:scale-95",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-flex items-center justify-center transition-colors",
                  isActive ? "text-[var(--accent)]" : "",
                ].join(" ")}
              >
                <Icon active={isActive} />
              </span>
              <span className="text-[10px] font-medium leading-none mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
