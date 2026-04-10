"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";
import { PLANS, TIER_LABELS } from "@/lib/pricing";

interface TierInfo {
  tier: string;
  tierExpiresAt: string | null;
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500 py-12">Loading...</div>}>
      <BillingContent />
    </Suspense>
  );
}

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#10b981", "#14b8a6", "#6ee7b7", "#fbbf24", "#f472b6", "#818cf8", "#34d399"];
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; rotation: number; rotSpeed: number;
    }> = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 300,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    let frame = 0;
    const animate = () => {
      if (frame > 180) return;
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
        ctx.globalAlpha = Math.max(0, 1 - frame / 180);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        ctx.restore();
      }
      frame++;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none" />;
}

function BillingContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const [tier, setTier] = useState<TierInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetch("/api/user/tier")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setTier(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Handle success/cancel from Stripe redirect
  useEffect(() => {
    if (success === "true") {
      setShowConfetti(true);
      addToast("Welcome to Pro! Your upgrade is being processed.", "info");
      setTimeout(() => setShowConfetti(false), 5000);
      // Re-fetch tier after a short delay (webhook may take a moment)
      setTimeout(() => {
        fetch("/api/user/tier")
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => { if (data) setTier(data); });
      }, 3000);
    } else if (canceled === "true") {
      addToast("Checkout canceled. No charges were made.", "error");
    }
  }, [success, canceled, addToast]);

  // Auto-trigger checkout if plan param is present and user is on free tier
  useEffect(() => {
    if (!tier || loading) return;
    if (tier.tier !== "free") return;
    if (success || canceled) return;

    if (plan === "pro" && process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
      handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID);
    } else if (plan === "family" && process.env.NEXT_PUBLIC_STRIPE_FAMILY_PRICE_ID) {
      handleCheckout(process.env.NEXT_PUBLIC_STRIPE_FAMILY_PRICE_ID);
    }
  }, [tier, loading, plan, success, canceled]);

  const handleCheckout = async (priceId: string) => {
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
  };

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

  const getProPriceId = () => {
    if (isYearly) {
      return process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || "";
    }
    return process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "";
  };

  const getFamilyPriceId = () => {
    if (isYearly) {
      return process.env.NEXT_PUBLIC_STRIPE_FAMILY_YEARLY_PRICE_ID || "";
    }
    return process.env.NEXT_PUBLIC_STRIPE_FAMILY_PRICE_ID || "";
  };

  const isPaid = tier?.tier === "pro" || tier?.tier === "family";

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {showConfetti && <Confetti />}

      <div>
        <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Billing</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your subscription and billing.</p>
      </div>

      {/* Success banner */}
      {success === "true" && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-medium text-emerald-400">You are now on the Pro plan!</p>
            <p className="text-xs text-gray-500">All Pro features are now unlocked. It may take a moment to reflect.</p>
          </div>
        </div>
      )}

      {/* Canceled banner */}
      {canceled === "true" && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-2xl">👋</span>
          <div>
            <p className="text-sm font-medium text-amber-400">Checkout canceled</p>
            <p className="text-xs text-gray-500">No charges were made. You can upgrade anytime.</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-8 text-center">
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      ) : (
        <>
          {/* Current Plan */}
          <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Current Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-400">
                  {TIER_LABELS[tier?.tier || "free"]}
                </p>
                {tier?.tierExpiresAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Renews {new Date(tier.tierExpiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              {isPaid && (
                <button
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-white/[0.1] text-gray-300 hover:bg-white/[0.06] transition-colors"
                >
                  {portalLoading ? "Opening..." : "Manage Subscription"}
                </button>
              )}
            </div>
          </div>

          {/* Upgrade Options (for free users) */}
          {!isPaid && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-100">Upgrade</h2>

                {/* Monthly / Yearly toggle */}
                <div className="inline-flex items-center gap-1 bg-white/[0.04] rounded-full border border-white/[0.06] p-0.5">
                  <button
                    onClick={() => setIsYearly(false)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      !isYearly
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-gray-400 border border-transparent hover:text-gray-300"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsYearly(true)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      isYearly
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-gray-400 border border-transparent hover:text-gray-300"
                    }`}
                  >
                    Yearly
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                      -2 mo
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/[0.04] rounded-2xl border border-emerald-500/20 p-6">
                  <h3 className="text-lg font-bold text-gray-100 mb-1">{PLANS.pro.name}</h3>
                  <p className="text-3xl font-bold text-emerald-400 mb-1">
                    {isYearly ? `$${Math.round(PLANS.pro.yearlyPriceNum / 12)}` : PLANS.pro.monthlyPrice}
                    <span className="text-sm text-gray-500 font-normal">/month</span>
                  </p>
                  {isYearly && PLANS.pro.yearlySavings && (
                    <p className="text-xs text-emerald-400 mb-1">
                      {PLANS.pro.yearlyPrice} billed annually
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 font-semibold">
                        {PLANS.pro.yearlySavings}
                      </span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mb-4">{PLANS.pro.description}</p>
                  <ul className="space-y-2 text-sm text-gray-400 mb-6">
                    {PLANS.pro.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleCheckout(getProPriceId())}
                    disabled={!!checkoutLoading}
                    className="w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    {checkoutLoading ? "Redirecting..." : `Upgrade to ${PLANS.pro.name}`}
                  </button>
                </div>

                <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-6">
                  <h3 className="text-lg font-bold text-gray-100 mb-1">{PLANS.family.name}</h3>
                  <p className="text-3xl font-bold text-teal-400 mb-1">
                    {isYearly ? `$${Math.round(PLANS.family.yearlyPriceNum / 12)}` : PLANS.family.monthlyPrice}
                    <span className="text-sm text-gray-500 font-normal">/month</span>
                  </p>
                  {isYearly && PLANS.family.yearlySavings && (
                    <p className="text-xs text-teal-400 mb-1">
                      {PLANS.family.yearlyPrice} billed annually
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-teal-500/15 font-semibold">
                        {PLANS.family.yearlySavings}
                      </span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mb-4">{PLANS.family.description}</p>
                  <ul className="space-y-2 text-sm text-gray-400 mb-6">
                    {PLANS.family.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleCheckout(getFamilyPriceId())}
                    disabled={!!checkoutLoading}
                    className="w-full px-4 py-2.5 text-sm font-medium rounded-xl border border-white/[0.1] text-gray-200 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                  >
                    {checkoutLoading ? "Redirecting..." : `Upgrade to ${PLANS.family.name}`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Back to dashboard */}
          <div className="text-center">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
