/**
 * Canonical tier-gated page.
 *
 * Copy to: src/app/(app)/<your-feature>/page.tsx
 *
 * Pattern:
 *   - Fetch the user's tier client-side (fast, doesn't block render).
 *   - While loading, show a skeleton (no flash of paywall).
 *   - If free, render the upgrade prompt.
 *   - If paid, render the real feature.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TierInfo {
  tier: "free" | "pro" | "family";
}

export default function GatedFeaturePage() {
  const [tier, setTier] = useState<TierInfo | null>(null);

  useEffect(() => {
    fetch("/api/user/tier")
      .then((res) => (res.ok ? res.json() : null))
      .then(setTier)
      .catch(() => setTier({ tier: "free" }));
  }, []);

  if (!tier) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  const isPaid = tier.tier === "pro" || tier.tier === "family";

  if (!isPaid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pro feature</CardTitle>
          <CardDescription>
            This is available on the Pro and Team plans.
          </CardDescription>
        </CardHeader>
        <Link href="/billing?plan=pro">
          <Button variant="primary">Upgrade to Pro</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
        Pro feature
      </h1>
      <p className="text-sm text-[var(--ink-1)]">
        Your real feature UI goes here.
      </p>
    </div>
  );
}
