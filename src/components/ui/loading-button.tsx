"use client";

import React from "react";
import { Button } from "@/components/ui/button";

// LoadingButton predates the `loading` prop on Button itself. Kept as a
// thin wrapper so existing call-sites still work, but new code should
// reach for `<Button loading>` directly.
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({
  loading = false,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button loading={loading} {...props}>
      {children}
    </Button>
  );
}
