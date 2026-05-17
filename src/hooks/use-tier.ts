"use client";

import { useCallback, useEffect, useState } from "react";

export interface TierInfo {
  tier: string;
  tierExpiresAt: string | null;
  hasStripeSubscription: boolean;
  hasStripeCustomer: boolean;
  emailReports?: boolean;
}

interface UseTierResult {
  tier: TierInfo | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Single source of truth for "what's the current user's tier" on the client.
 * Dashboard, billing, and settings all need this — the pre-refactor pattern
 * was three near-identical useEffects. This hook collapses them, exposes a
 * loading flag so callers can render a skeleton, and a refetch() so the
 * Stripe-redirect flow can re-sync after a webhook lands.
 */
export function useTier(): UseTierResult {
  const [tier, setTier] = useState<TierInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/user/tier");
      if (!res.ok) {
        setTier(null);
        return;
      }
      const data: TierInfo = await res.json();
      setTier(data);
    } catch {
      setTier(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { tier, loading, refetch };
}
