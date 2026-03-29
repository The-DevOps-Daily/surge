"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  // Add your nav items here:
  // { href: "/your-page", label: "Your Page", icon: "📋" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-[#0d0d14] border-r border-white/[0.06] h-screen sticky top-0">
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🚀</span>
          <div>
            <h1 className="text-lg font-bold text-gray-100 tracking-tight">
              SaaS App
            </h1>
            <p className="text-xs text-gray-500">
              Your tagline here
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border-l-[3px] border-emerald-500 pl-[13px]"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        <div className="flex items-center gap-3 px-4 py-1">
          <ThemeToggle />
          <span className="text-sm text-gray-500">Theme</span>
        </div>
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-violet-400/70 hover:bg-violet-500/10 hover:text-violet-400 transition-all duration-200 min-h-[44px]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Admin
          </Link>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 min-h-[44px]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
