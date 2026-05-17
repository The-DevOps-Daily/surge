"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--surface-0)] relative">
      {/* Restrained mesh — soft accent puddle in the top-left + neutral tint
       * top-right. Anchored to the page, never the content area. */}
      <div className="bg-mesh" />
      <Sidebar />
      <main className="flex-1 pb-24 md:pb-0 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-10">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
