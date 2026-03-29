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

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500/[0.08] to-teal-500/[0.05] backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3">
        Stay in the loop
      </h2>
      <p className="text-gray-400 mb-6 max-w-lg mx-auto">
        Join our newsletter for product updates, tips, and exclusive content. No spam, unsubscribe anytime.
      </p>
      {submitted ? (
        <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          You&apos;re in! Check your inbox for a welcome email.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

// TODO: Replace with your actual features
const features = [
  {
    icon: "🚀",
    title: "Feature One",
    description: "Describe your first key feature here. What problem does it solve for your users?",
  },
  {
    icon: "🔒",
    title: "Feature Two",
    description: "Describe your second feature. Focus on the benefit, not just the functionality.",
  },
  {
    icon: "📊",
    title: "Feature Three",
    description: "Another feature that sets your product apart from the competition.",
  },
  {
    icon: "⚡",
    title: "Feature Four",
    description: "Speed, performance, reliability -- whatever matters most to your users.",
  },
  {
    icon: "🎨",
    title: "Feature Five",
    description: "Beautiful design, great UX, or any other quality your users will appreciate.",
  },
  {
    icon: "📱",
    title: "Mobile First",
    description: "Beautiful on every device. Designed for your phone, polished for your desktop.",
  },
];

// TODO: Replace with your actual pricing tiers
const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Core features",
      "Basic dashboard",
      "Community support",
    ],
    cta: "Start Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For power users",
    features: [
      "Everything in Free",
      "Unlimited usage",
      "Advanced features",
      "CSV & JSON export",
      "Email notifications",
      "Priority support",
    ],
    cta: "Get Pro",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Multiple seats",
      "Shared dashboards",
      "Admin controls",
      "Dedicated support",
    ],
    cta: "Get Team",
    href: "/register",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] bg-violet-500/[0.02] rounded-full blur-[128px]" />
        {/* Grid overlay */}
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
          <span className="text-lg font-bold text-gray-100">SaaS App</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="#features" className="hidden sm:block text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hidden sm:block text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="hidden sm:block text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Blog
          </Link>
          <Link href="/tools/sample-tool" className="hidden sm:block text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Tools
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-28 md:pb-36 text-center">
        <FadeInSection>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Now available for everyone
          </div>
        </FadeInSection>

        <FadeInSection delay={100}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Your SaaS App Name
            </span>
            <br />
            {/* TODO: Replace with your tagline */}
            <span className="text-gray-100">Built for What Matters</span>
          </h1>
        </FadeInSection>

        <FadeInSection delay={200}>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {/* TODO: Replace with your product description */}
            A brief description of what your app does and why users should care.
            Beautiful, private, and built for people who take their work seriously.
          </p>
        </FadeInSection>

        <FadeInSection delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 min-w-[180px]"
            >
              Start Free
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white/[0.06] text-gray-300 border border-white/[0.08] rounded-xl font-semibold text-base hover:bg-white/[0.1] transition-all duration-200 min-w-[180px]"
            >
              Learn More
            </Link>
          </div>
        </FadeInSection>
      </section>

      {/* Dashboard Preview */}
      <section id="preview" className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <FadeInSection>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3">See it in action</h2>
            <p className="text-gray-400">A premium dashboard designed for clarity</p>
          </div>
        </FadeInSection>

        <FadeInSection delay={100}>
          {/* Browser chrome mockup */}
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/40">
            {/* Browser toolbar */}
            <div className="bg-white/[0.04] border-b border-white/[0.06] px-4 py-3 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/[0.06] rounded-lg px-4 py-1 text-xs text-gray-500 min-w-[200px] text-center">
                  your-app.com
                </div>
              </div>
            </div>

            {/* Dashboard content mockup */}
            <div className="bg-[#0a0a0f] p-6 md:p-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-lg font-bold text-gray-100">Welcome back</p>
                  <p className="text-sm text-gray-500 mt-1">Here is your overview for today</p>
                </div>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Metric One", value: "1,234", color: "text-emerald-400" },
                  { label: "Metric Two", value: "567", color: "text-teal-300" },
                  { label: "Metric Three", value: "89%", color: "text-violet-400" },
                  { label: "Metric Four", value: "$4,200", color: "text-amber-400" },
                ].map((m) => (
                  <div key={m.label} className="bg-white/[0.04] rounded-xl border border-white/[0.06] p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{m.label}</p>
                    <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Chart mockup */}
              <div className="bg-white/[0.04] rounded-xl border border-white/[0.06] p-4 h-40 flex items-end gap-1">
                {[35, 38, 42, 40, 48, 55, 52, 60, 65, 70, 68, 75, 82, 85, 90, 88, 95, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-emerald-500/40 to-emerald-500/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              {/* TODO: Replace with your features headline */}
              Everything you need to succeed
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Powerful tools, beautiful design, and privacy by default.
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

      {/* Testimonials */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              What our users are saying
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              {/* TODO: Replace with your social proof headline */}
              Real feedback from real users.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Alex J.",
              role: "Software Engineer",
              initials: "AJ",
              color: "from-emerald-500 to-teal-500",
              quote: "This is exactly what I was looking for. Clean, fast, and easy to use. Highly recommended for anyone who values simplicity.",
            },
            {
              name: "Sam K.",
              role: "Product Manager",
              initials: "SK",
              color: "from-violet-500 to-purple-500",
              quote: "The best tool in its category. I switched from a competitor and never looked back. The attention to detail is remarkable.",
            },
            {
              name: "Jordan L.",
              role: "Freelancer",
              initials: "JL",
              color: "from-amber-500 to-orange-500",
              quote: "I have tried many alternatives and this one stands out. The mobile experience is perfect and the dashboard gives me everything at a glance.",
            },
          ].map((t, i) => (
            <FadeInSection key={t.name} delay={i * 100}>
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-100">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex gap-0.5 mt-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Start free, upgrade when you are ready. No hidden fees.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tiers.map((tier, i) => (
            <FadeInSection key={tier.name} delay={i * 100}>
              <div
                className={`relative rounded-2xl border p-6 flex flex-col h-full transition-all duration-300 ${
                  tier.highlighted
                    ? "bg-white/[0.06] border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                    : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07]"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-1">{tier.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{tier.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-100">{tier.price}</span>
                    <span className="text-sm text-gray-500">{tier.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                      : "bg-white/[0.06] text-gray-300 border border-white/[0.08] hover:bg-white/[0.1]"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl border border-white/[0.06] p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of users who trust us. Free forever, no credit card required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200"
            >
              Get Started for Free
            </Link>
          </div>
        </FadeInSection>
      </section>

      {/* Newsletter */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <FadeInSection>
          <NewsletterSection />
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
              <span className="font-semibold text-gray-200">SaaS App</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <Link href="#features" className="hover:text-gray-300 transition-colors">Features</Link>
              <Link href="#pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
              <Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
              <Link href="/tools/sample-tool" className="hover:text-gray-300 transition-colors">Tools</Link>
              <Link href="/compare" className="hover:text-gray-300 transition-colors">Compare</Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
              <Link href="/login" className="hover:text-gray-300 transition-colors">Login</Link>
              <Link href="/register" className="hover:text-gray-300 transition-colors">Register</Link>
            </div>

            <p className="text-xs text-gray-600">
              Built with privacy in mind - your data stays yours.
            </p>
          </div>
          <div className="text-center mt-8">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} SaaS App. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
