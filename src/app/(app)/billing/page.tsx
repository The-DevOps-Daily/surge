"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PLANS, TIER_LABELS, isPaidTier } from "@/lib/pricing";
import { useTier } from "@/hooks/use-tier";

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-12 text-center">
          <p className="text-sm text-[var(--ink-1)]">Loading...</p>
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#4ade80";
    const accentStrong =
      styles.getPropertyValue("--accent-strong").trim() || "#22c55e";
    const warn = styles.getPropertyValue("--warn").trim() || "#fbbf24";
    const ink = styles.getPropertyValue("--ink-3").trim() || "#fafafa";
    const colors = [accent, accentStrong, warn, ink];

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotSpeed: number;
    }> = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 300,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 7 + 3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    let frame = 0;
    let raf = 0;
    const animate = () => {
      if (frame > 200) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / 200);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        ctx.restore();
      }
      frame++;
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
}

interface PlanCardProps {
  planKey: "pro" | "family";
  isYearly: boolean;
  highlighted: boolean;
  loading: boolean;
  onCheckout: (priceId: string) => void;
  monthlyPriceId: string;
  yearlyPriceId: string;
}

function PlanCard({
  planKey,
  isYearly,
  highlighted,
  loading,
  onCheckout,
  monthlyPriceId,
  yearlyPriceId,
}: PlanCardProps) {
  const plan = PLANS[planKey];
  const priceId = isYearly ? yearlyPriceId : monthlyPriceId;
  const displayPrice = isYearly
    ? `$${Math.round(plan.yearlyPriceNum / 12)}`
    : plan.monthlyPrice;

  return (
    <div
      className={`relative rounded-[18px] border p-6 flex flex-col bg-[var(--surface-1)] ${
        highlighted
          ? "border-[var(--ink-3)] shadow-[var(--shadow-2)]"
          : "border-[var(--line-1)]"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] uppercase tracking-[0.06em] font-semibold bg-[var(--ink-3)] text-[var(--surface-0)]">
          Popular
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--ink-3)] mb-1">
        {plan.name}
      </h3>
      <p className="text-xs text-[var(--ink-1)] mb-4">{plan.description}</p>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
          {displayPrice}
        </span>
        <span className="text-sm text-[var(--ink-1)]">/month</span>
      </div>
      {isYearly && plan.yearlySavings && (
        <p className="text-xs text-[var(--accent)] mb-4 font-medium">
          {plan.yearlyPrice} billed annually · {plan.yearlySavings}
        </p>
      )}
      {!isYearly && <div className="mb-4" />}
      <ul className="space-y-2 text-sm text-[var(--ink-2)] mb-6 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Button
        variant={highlighted ? "primary" : "secondary"}
        className="w-full"
        loading={loading}
        disabled={!priceId}
        onClick={() => onCheckout(priceId)}
      >
        {priceId ? `Upgrade to ${plan.name}` : "Configure Stripe IDs"}
      </Button>
    </div>
  );
}

function BillingContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const { tier, loading, refetch } = useTier();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const { addToast } = useToast();

  const handleCheckout = useCallback(
    async (priceId: string) => {
      if (!priceId) return;
      setCheckoutLoading(priceId);
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          addToast(data.error || "Could not create checkout session", "error");
        }
      } catch {
        addToast("Failed to start checkout", "error");
      } finally {
        setCheckoutLoading(null);
      }
    },
    [addToast],
  );

  useEffect(() => {
    if (success === "true") {
      setShowConfetti(true);
      addToast("Welcome to Pro! Your upgrade is being processed.", "info");
      const t = setTimeout(() => setShowConfetti(false), 5000);
      const refetchTimer = setTimeout(() => {
        refetch();
      }, 3000);
      return () => {
        clearTimeout(t);
        clearTimeout(refetchTimer);
      };
    } else if (canceled === "true") {
      addToast("Checkout canceled. No charges were made.", "error");
    }
  }, [success, canceled, addToast, refetch]);

  useEffect(() => {
    if (!tier || loading) return;
    if (tier.tier !== "free") return;
    if (success || canceled) return;

    if (plan === "pro" && process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
      handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID);
    } else if (
      plan === "family" &&
      process.env.NEXT_PUBLIC_STRIPE_FAMILY_PRICE_ID
    ) {
      handleCheckout(process.env.NEXT_PUBLIC_STRIPE_FAMILY_PRICE_ID);
    }
  }, [tier, loading, plan, success, canceled, handleCheckout]);

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        addToast("Could not open billing portal", "error");
      }
    } catch {
      addToast("Failed to open billing portal", "error");
    } finally {
      setPortalLoading(false);
    }
  };

  const isPaid = isPaidTier(tier?.tier);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {showConfetti && <Confetti />}

      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
          Billing
        </h1>
        <p className="text-sm text-[var(--ink-1)] mt-1.5">
          Manage your subscription and billing.
        </p>
      </div>

      {success === "true" && (
        <div
          role="status"
          className="flex items-start gap-3 px-5 py-4 rounded-[14px] border border-[var(--line-1)] bg-[var(--accent-soft)]"
        >
          <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-1)] border border-[var(--line-1)] flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-[var(--accent)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--ink-3)]">
              You are now on a paid plan
            </p>
            <p className="text-xs text-[var(--ink-1)] mt-0.5">
              All features are unlocked. It may take a moment to reflect.
            </p>
          </div>
        </div>
      )}

      {canceled === "true" && (
        <div
          role="status"
          className="flex items-start gap-3 px-5 py-4 rounded-[14px] border border-[var(--line-1)] bg-[var(--warn-soft)]"
        >
          <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-1)] border border-[var(--line-1)] flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-[var(--warn)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--ink-3)]">
              Checkout canceled
            </p>
            <p className="text-xs text-[var(--ink-1)] mt-0.5">
              No charges were made. You can upgrade anytime.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-12 text-center">
          <p className="text-sm text-[var(--ink-1)]">Loading...</p>
        </div>
      ) : (
        <>
          <div className="rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6 shadow-[var(--shadow-1)]">
            <h2 className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium mb-4">
              Current plan
            </h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
                  {TIER_LABELS[tier?.tier || "free"]}
                </p>
                {tier?.tierExpiresAt && (
                  <p className="text-xs text-[var(--ink-1)] mt-1">
                    Renews{" "}
                    {new Date(tier.tierExpiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              {isPaid && (
                <Button
                  variant="secondary"
                  onClick={handlePortal}
                  loading={portalLoading}
                >
                  Manage subscription
                </Button>
              )}
            </div>
          </div>

          {!isPaid && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
                  Upgrade
                </h2>

                <div
                  role="tablist"
                  aria-label="Billing period"
                  className="inline-flex items-center rounded-full border border-[var(--line-1)] bg-[var(--surface-1)] p-0.5"
                >
                  <button
                    role="tab"
                    aria-selected={!isYearly}
                    onClick={() => setIsYearly(false)}
                    className={`px-3 h-7 rounded-full text-xs font-medium transition-colors focus-ring ${
                      !isYearly
                        ? "bg-[var(--ink-3)] text-[var(--surface-0)]"
                        : "text-[var(--ink-1)] hover:text-[var(--ink-3)]"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    role="tab"
                    aria-selected={isYearly}
                    onClick={() => setIsYearly(true)}
                    className={`px-3 h-7 rounded-full text-xs font-medium transition-colors focus-ring inline-flex items-center gap-1.5 ${
                      isYearly
                        ? "bg-[var(--ink-3)] text-[var(--surface-0)]"
                        : "text-[var(--ink-1)] hover:text-[var(--ink-3)]"
                    }`}
                  >
                    Yearly
                    <span
                      className={`text-[9px] uppercase tracking-[0.06em] font-semibold px-1.5 py-0.5 rounded-full ${
                        isYearly
                          ? "bg-[var(--surface-0)] text-[var(--accent)]"
                          : "bg-[var(--accent-soft)] text-[var(--accent)]"
                      }`}
                    >
                      -2mo
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PlanCard
                  planKey="pro"
                  isYearly={isYearly}
                  highlighted
                  loading={
                    checkoutLoading ===
                    (isYearly
                      ? process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID
                      : process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID)
                  }
                  onCheckout={handleCheckout}
                  monthlyPriceId={
                    process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || ""
                  }
                  yearlyPriceId={
                    process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || ""
                  }
                />
                <PlanCard
                  planKey="family"
                  isYearly={isYearly}
                  highlighted={false}
                  loading={
                    checkoutLoading ===
                    (isYearly
                      ? process.env.NEXT_PUBLIC_STRIPE_FAMILY_YEARLY_PRICE_ID
                      : process.env.NEXT_PUBLIC_STRIPE_FAMILY_PRICE_ID)
                  }
                  onCheckout={handleCheckout}
                  monthlyPriceId={
                    process.env.NEXT_PUBLIC_STRIPE_FAMILY_PRICE_ID || ""
                  }
                  yearlyPriceId={
                    process.env.NEXT_PUBLIC_STRIPE_FAMILY_YEARLY_PRICE_ID || ""
                  }
                />
              </div>
            </div>
          )}

          <div className="text-center pt-4">
            <Link
              href="/dashboard"
              className="text-sm text-[var(--ink-1)] hover:text-[var(--ink-3)] transition-colors focus-ring rounded-md"
            >
              ← Back to dashboard
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
