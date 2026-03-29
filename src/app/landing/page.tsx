"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

const features = [
  {
    icon: "\u{1F510}",
    title: "Authentication",
    description: "Login, register, forgot password, rate limiting, and account deletion. Toggle registration on or off with a single env var.",
  },
  {
    icon: "\u{1F4B3}",
    title: "Stripe Payments",
    description: "Checkout sessions, customer portal, webhook handling, tier-based feature gating, and upgrade prompts. All wired up and ready.",
  },
  {
    icon: "\u{1F451}",
    title: "Admin Dashboard",
    description: "User management, signup analytics, MRR tracking, system health monitoring, and environment audit. Role-gated and secure.",
  },
  {
    icon: "\u{1F4DD}",
    title: "Blog Engine",
    description: "Markdown-powered blog with reading progress, table of contents, share buttons, and OG image generation. Just add posts.",
  },
  {
    icon: "\u{1F3A8}",
    title: "Premium UI",
    description: "Dark glassmorphism design, mobile-first responsive layout, PWA support, and theme toggle. Beautiful out of the box.",
  },
  {
    icon: "\u{1F680}",
    title: "Deploy Ready",
    description: "Docker, CI/CD with GitHub Actions, PostgreSQL, Nginx with SSL, and 135+ tests. Push to main and go live.",
  },
];

const includedItems = [
  { category: "Auth", items: ["Email/password login", "Registration toggle", "Forgot password flow", "Rate limiting", "Account deletion"] },
  { category: "Payments", items: ["Stripe checkout", "Customer portal", "Webhook handlers", "Tier limits", "Upgrade prompts"] },
  { category: "Admin", items: ["User management", "Stats dashboard", "System health", "Content inventory", "Role management"] },
  { category: "Marketing", items: ["Landing page", "Blog engine", "Free tools template", "Comparison page", "SEO (sitemap, robots, OG)"] },
  { category: "UI", items: ["Dark/light theme", "Mobile bottom nav", "Desktop sidebar", "Toast notifications", "Confirm dialogs"] },
  { category: "Infra", items: ["Docker Compose", "GitHub Actions CI/CD", "PostgreSQL + SQLite", "Server setup script", "135+ Vitest tests"] },
];

const techStack = [
  { name: "Next.js 14+", category: "Framework" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Prisma", category: "ORM" },
  { name: "NextAuth v5", category: "Auth" },
  { name: "Stripe", category: "Payments" },
  { name: "Recharts", category: "Charts" },
  { name: "Resend", category: "Email" },
  { name: "Docker", category: "Deploy" },
  { name: "Vitest", category: "Testing" },
];

const steps = [
  { step: "1", title: "Clone", command: "git clone <repo-url> my-app" },
  { step: "2", title: "Install", command: "bun install" },
  { step: "3", title: "Configure", command: "cp .env.example .env" },
  { step: "4", title: "Launch", command: "bun run dev" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] bg-violet-500/[0.02] rounded-full blur-[128px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
        <Link href="/landing" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold text-gray-100">SaaS Starter</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="#features" className="hidden sm:block text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Features
          </Link>
          <Link href="#included" className="hidden sm:block text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Included
          </Link>
          <Link href="#stack" className="hidden sm:block text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Tech Stack
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2"
          >
            Live Demo
          </Link>
          <Link
            href="https://github.com"
            className="text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-28 md:pb-36 text-center">
        <FadeInSection>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Open source and MIT licensed
          </div>
        </FadeInSection>

        <FadeInSection delay={100}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Ship Your SaaS
            </span>
            <br />
            <span className="text-gray-100">in Days, Not Months</span>
          </h1>
        </FadeInSection>

        <FadeInSection delay={200}>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Production-ready starter kit with auth, payments, admin, blog, and more.
            Built with Next.js, Stripe, and love.
          </p>
        </FadeInSection>

        <FadeInSection delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://github.com"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 min-w-[180px]"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white/[0.06] text-gray-300 border border-white/[0.08] rounded-xl font-semibold text-base hover:bg-white/[0.1] transition-all duration-200 min-w-[180px]"
            >
              Live Demo
            </Link>
          </div>
        </FadeInSection>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Everything you need to launch
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Stop rebuilding authentication, payments, and admin panels. Start with everything already wired up.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeInSection key={f.title} delay={i * 80}>
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 h-full">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* What's Included */}
      <section id="included" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              What&apos;s included
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              A detailed look at every feature packed into the starter kit.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {includedItems.map((group, i) => (
            <FadeInSection key={group.category} delay={i * 80}>
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 h-full">
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
                  {group.category}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section id="stack" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Built with modern tools
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              A carefully chosen stack that scales from side project to production.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={100}>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="bg-white/[0.04] backdrop-blur-xl rounded-xl border border-white/[0.06] px-5 py-3 hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300"
              >
                <p className="text-sm font-medium text-gray-200">{tech.name}</p>
                <p className="text-[11px] text-gray-500">{tech.category}</p>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Getting Started */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Up and running in minutes
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Four commands and you have a fully functional SaaS app.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <FadeInSection key={s.step} delay={i * 100}>
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 text-center h-full">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-400 font-bold text-sm">{s.step}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-100 mb-2">{s.title}</h3>
                <code className="text-xs text-gray-400 bg-white/[0.06] px-2 py-1 rounded-lg font-mono">
                  {s.command}
                </code>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="bg-gradient-to-br from-emerald-500/[0.08] to-teal-500/[0.05] backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Stop rebuilding the same infrastructure
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Start building your product. Auth, payments, admin, blog, and deployment are already done.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://github.com"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200"
              >
                Get Started for Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/[0.06] text-gray-300 border border-white/[0.08] rounded-xl font-semibold text-base hover:bg-white/[0.1] transition-all duration-200"
              >
                Try the Demo
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] mt-12">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="font-semibold text-gray-200">SaaS Starter</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <Link href="#features" className="hover:text-gray-300 transition-colors">Features</Link>
              <Link href="#included" className="hover:text-gray-300 transition-colors">Included</Link>
              <Link href="#stack" className="hover:text-gray-300 transition-colors">Tech Stack</Link>
              <Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
              <Link href="/login" className="hover:text-gray-300 transition-colors">Demo</Link>
            </div>

            <p className="text-xs text-gray-600">
              MIT License. Build whatever you want.
            </p>
          </div>
          <div className="text-center mt-8">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} SaaS Starter Kit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
