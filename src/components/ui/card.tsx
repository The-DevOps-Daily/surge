"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-100 ${className}`}>
      {children}
    </h3>
  );
}
