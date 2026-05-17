"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function DashboardIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 21a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 21a5 5 0 0 1 6.5-4.8" />
    </svg>
  );
}
function ContentIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path d="M5 4h14v16H5z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}
function SystemIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M19 12h2M3 12h2M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </svg>
  );
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/content", label: "Content", icon: ContentIcon },
  { href: "/admin/system", label: "System", icon: SystemIcon },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--line-1)] bg-[var(--surface-1)] safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
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
              <span className={["inline-flex", isActive ? "text-[var(--warn)]" : ""].join(" ")}>
                <Icon />
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
