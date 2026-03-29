"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  // Add your nav items here:
  // { href: "/your-page", label: "Your Page", icon: "📋" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d0d14]/90 backdrop-blur-xl border-t border-white/[0.06] z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 min-w-[56px] min-h-[44px] rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-emerald-400 scale-105"
                  : "text-gray-500 hover:text-gray-300 active:scale-95"
              }`}
            >
              <span className={`text-xl transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium ${isActive ? "text-emerald-400" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
