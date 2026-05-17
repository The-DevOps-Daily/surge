"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

// IntersectionObserver-driven fade so sections enter as the user scrolls
// past them. Honours prefers-reduced-motion by snapping the element into
// place rather than animating.
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-[600ms] ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// Terminal-style mock card for the hero. Static — no animation needed, the
// visual itself is the message: "this is what extending the kit looks like".
function HeroTerminal() {
  return (
    <div className="max-w-2xl mx-auto text-left">
      <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] shadow-[var(--shadow-3)] overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 h-9 border-b border-[var(--line-1)] bg-[var(--surface-2)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--danger)] opacity-70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--warn)] opacity-70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] opacity-70" />
          <span className="ml-3 text-xs text-[var(--ink-1)] font-mono">
            ~/my-saas › claude
          </span>
        </div>
        <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-[1.7] font-mono text-[var(--ink-2)] overflow-x-auto whitespace-pre">
{`> `}<span className="text-[var(--ink-3)]">/customize</span>{`

`}<span className="text-[var(--ink-1)]">Walking you through making this kit yours.
Product name?</span>{`  Linear-but-for-X
`}<span className="text-[var(--ink-1)]">Accent color?</span>{`   amber
`}<span className="text-[var(--ink-1)]">Domain?</span>{`         lbfx.app

`}<span className="text-[var(--accent)]">✓ </span>{`Brand swap committed (17 files).
`}<span className="text-[var(--accent)]">✓ </span>{`Stripe price IDs scaffolded in .env.
`}<span className="text-[var(--accent)]">✓ </span>{`Landing copy + comparison rewritten.

`}<span className="text-[var(--ink-1)]">›</span>{` `}<span className="text-[var(--accent)] animate-pulse">▍</span>
        </pre>
      </div>
      <p className="text-center text-xs text-[var(--ink-1)] mt-3">
        Five built-in skills cover the most common SaaS scaffolding. See{" "}
        <Link
          href="/docs/ai-first"
          className="text-[var(--ink-2)] hover:text-[var(--accent)] underline-offset-4 hover:underline"
        >
          AI-first features
        </Link>
        .
      </p>
    </div>
  );
}

const features = [
  {
    title: "Authentication",
    description:
      "Login, register, forgot password, rate limiting, account deletion. Toggle registration on or off with one env var.",
  },
  {
    title: "Stripe payments",
    description:
      "Checkout sessions, customer portal, webhook handling, tier-based feature gating, upgrade prompts. All wired up.",
  },
  {
    title: "Admin dashboard",
    description:
      "User management, signup analytics, MRR tracking, system health, env audit. Role-gated and secure.",
  },
  {
    title: "Blog engine",
    description:
      "Markdown-powered with reading progress, table of contents, share buttons, dynamic OG images. Just add posts.",
  },
  {
    title: "Premium UI",
    description:
      "Tokenised dark theme, mobile-first responsive layout, PWA support, accessible primitives. Looks good on day one.",
  },
  {
    title: "Deploy ready",
    description:
      "Docker, GitHub Actions CI/CD, PostgreSQL, Nginx with SSL, 135+ tests. Push to main and go live.",
  },
];

const includedItems = [
  {
    category: "Auth",
    items: [
      "Email + password login",
      "Registration toggle",
      "Forgot password flow",
      "Rate limiting",
      "Account deletion",
    ],
  },
  {
    category: "Payments",
    items: [
      "Stripe checkout",
      "Customer portal",
      "Webhook handlers",
      "Tier limits",
      "Upgrade prompts",
    ],
  },
  {
    category: "Admin",
    items: [
      "User management",
      "Stats dashboard",
      "System health",
      "Content inventory",
      "Role management",
    ],
  },
  {
    category: "Marketing",
    items: [
      "Landing page",
      "Blog engine",
      "Free tools template",
      "Comparison page",
      "SEO (sitemap, robots, OG)",
    ],
  },
  {
    category: "UI",
    items: [
      "Dark + light themes",
      "Mobile bottom nav",
      "Desktop sidebar",
      "Toasts",
      "Confirm dialogs",
    ],
  },
  {
    category: "Infra",
    items: [
      "Docker Compose",
      "GitHub Actions CI/CD",
      "PostgreSQL + SQLite",
      "Server setup script",
      "135+ Vitest tests",
    ],
  },
];

const techStack = [
  { name: "Next.js 16", category: "Framework" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Prisma", category: "ORM" },
  { name: "NextAuth v5", category: "Auth" },
  { name: "Stripe", category: "Payments" },
  { name: "Recharts", category: "Charts" },
  { name: "smtpfa.st", category: "Email" },
  { name: "Docker", category: "Deploy" },
  { name: "Vitest", category: "Testing" },
];

const steps = [
  { step: "01", title: "Clone", command: "git clone <repo-url> my-app" },
  { step: "02", title: "Install", command: "bun install" },
  { step: "03", title: "Configure", command: "cp .env.example .env" },
  { step: "04", title: "Launch", command: "bun run dev" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-2)] overflow-x-hidden">
      {/* Background: one soft accent puddle, one neutral. No more gradient
       * pile-up. */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-[640px] h-[640px] rounded-full blur-[140px] bg-[var(--accent-soft)]" />
        <div className="absolute top-1/2 -right-32 w-[520px] h-[520px] rounded-full blur-[140px] opacity-50 bg-[var(--surface-2)]" />
      </div>

      <MarketingNav />

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-20 md:pt-28 md:pb-24 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--line-2)] bg-[var(--surface-1)] text-[var(--ink-2)] text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Built for Claude Code · MIT licensed
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-[44px] sm:text-6xl md:text-7xl font-semibold tracking-[-0.02em] leading-[1.05] text-[var(--ink-3)] mb-6">
            Ship your SaaS<br className="hidden sm:block" />{" "}
            <span className="text-[var(--ink-1)]">in prompts, not months.</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="text-base md:text-lg text-[var(--ink-1)] max-w-2xl mx-auto mb-10 leading-relaxed">
            A production-grade Next.js starter with auth, payments, an admin
            console, a blog engine, and the boring infrastructure already done.
            Plus skills, subagents, and an MCP server so your AI agent extends
            it in a few prompts instead of grepping for hours.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              href="https://github.com/The-DevOps-Daily/surge"
              className="inline-flex items-center justify-center h-12 px-6 rounded-[14px] bg-[var(--ink-3)] text-[var(--surface-0)] font-medium text-base hover:bg-[var(--ink-2)] transition-colors focus-ring min-w-[180px]"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-12 px-6 rounded-[14px] bg-[var(--surface-1)] text-[var(--ink-3)] border border-[var(--line-2)] font-medium text-base hover:bg-[var(--surface-2)] transition-colors focus-ring min-w-[180px]"
            >
              Live demo
            </Link>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <HeroTerminal />
        </Reveal>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24">
        <Reveal>
          <div className="max-w-xl mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--accent)] mb-3">
              What's in the box
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.015em] text-[var(--ink-3)]">
              Everything you need to launch.
            </h2>
            <p className="mt-3 text-[var(--ink-1)] text-base">
              Stop rebuilding authentication, payments, and admin panels.
              Start with everything already wired up.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="h-full rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6 transition-colors hover:border-[var(--line-2)]">
                <h3 className="text-base font-semibold text-[var(--ink-3)] tracking-tight mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--ink-1)] leading-relaxed">
                  {f.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section id="included" className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24">
        <Reveal>
          <div className="max-w-xl mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--accent)] mb-3">
              Detailed scope
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.015em] text-[var(--ink-3)]">
              The full inventory.
            </h2>
            <p className="mt-3 text-[var(--ink-1)] text-base">
              A look at every feature packed into the starter.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {includedItems.map((group, i) => (
            <Reveal key={group.category} delay={i * 60}>
              <div className="h-full rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6">
                <h3 className="text-[11px] font-semibold text-[var(--ink-1)] uppercase tracking-[0.06em] mb-4">
                  {group.category}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-[var(--ink-2)]"
                    >
                      <svg
                        className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section id="stack" className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24">
        <Reveal>
          <div className="max-w-xl mx-auto text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--accent)] mb-3">
              Stack
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.015em] text-[var(--ink-3)]">
              Built on the boring stack you already trust.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="rounded-[12px] border border-[var(--line-1)] bg-[var(--surface-1)] px-4 py-2.5 transition-colors hover:border-[var(--line-2)]"
              >
                <p className="text-sm font-medium text-[var(--ink-3)]">{tech.name}</p>
                <p className="text-[11px] text-[var(--ink-1)]">{tech.category}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Getting started */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24">
        <Reveal>
          <div className="max-w-xl mx-auto text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--accent)] mb-3">
              Setup
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.015em] text-[var(--ink-3)]">
              Up and running in minutes.
            </h2>
            <p className="mt-3 text-[var(--ink-1)] text-base">
              Four commands and you have a fully functional SaaS app.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 80}>
              <div className="h-full rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6">
                <div className="text-xs font-mono font-semibold text-[var(--ink-1)] mb-3">
                  {s.step}
                </div>
                <h3 className="text-base font-semibold text-[var(--ink-3)] tracking-tight mb-3">
                  {s.title}
                </h3>
                <code className="block text-[12px] text-[var(--ink-2)] bg-[var(--surface-2)] px-3 py-2 rounded-[10px] font-mono break-all">
                  {s.command}
                </code>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24">
        <Reveal>
          <div className="rounded-[28px] border border-[var(--line-2)] bg-[var(--surface-1)] p-10 md:p-16 text-center shadow-[var(--shadow-2)]">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.015em] text-[var(--ink-3)] mb-4">
              Stop rebuilding the same infrastructure.
            </h2>
            <p className="text-[var(--ink-1)] text-base mb-8 max-w-xl mx-auto">
              Start building your product. Auth, payments, admin, blog, and
              deployment are already done.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="https://github.com"
                className="inline-flex items-center justify-center h-12 px-6 rounded-[14px] bg-[var(--ink-3)] text-[var(--surface-0)] font-medium text-base hover:bg-[var(--ink-2)] transition-colors focus-ring"
              >
                Get started for free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-12 px-6 rounded-[14px] bg-[var(--surface-2)] text-[var(--ink-3)] border border-[var(--line-2)] font-medium text-base hover:bg-[var(--surface-3)] transition-colors focus-ring"
              >
                Try the demo
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </div>
  );
}
