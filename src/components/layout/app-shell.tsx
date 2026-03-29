"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f] relative">
      {/* Background mesh gradient */}
      <div className="bg-mesh" />
      <Sidebar />
      <main className="flex-1 pb-24 md:pb-0 relative z-10">
        <div className="max-w-6xl mx-auto p-4 md:p-8">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
