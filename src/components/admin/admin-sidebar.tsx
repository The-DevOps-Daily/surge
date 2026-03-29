"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "\u{1F4CA}" },
  { href: "/admin/users", label: "Users", icon: "\u{1F465}" },
  { href: "/admin/content", label: "Content", icon: "\u{1F4DD}" },
  { href: "/admin/system", label: "System", icon: "\u{1F527}" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-[#0d0d14] border-r border-white/[0.06] h-screen sticky top-0">
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{"\u{1F6E1}\u{FE0F}"}</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-100 tracking-tight">
                SaaS App
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                Admin
              </span>
            </div>
            <p className="text-xs text-gray-500">Administration Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] ${
                isActive
                  ? "bg-violet-500/10 text-violet-400 border-l-[3px] border-violet-500 pl-[13px]"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/[0.06]">
        <Link
          href="/"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/[0.04] hover:text-gray-300 transition-all duration-200 min-h-[44px]"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to App
        </Link>
      </div>
    </aside>
  );
}
