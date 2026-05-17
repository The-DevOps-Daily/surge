import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--surface-0)] relative overflow-hidden">
      <div className="bg-mesh" />
      <div className="relative z-10 text-center max-w-md w-full">
        <p className="text-[88px] leading-none font-semibold tracking-[-0.04em] text-[var(--ink-3)] mb-3">
          404
        </p>
        <h1 className="text-xl font-semibold text-[var(--ink-3)] mb-3 tracking-[-0.005em]">
          Page not found
        </h1>
        <p className="text-[var(--ink-1)] mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-[12px] bg-[var(--ink-3)] text-[var(--surface-0)] text-sm font-medium hover:opacity-90 transition-opacity focus-ring"
        >
          Go back home
        </Link>
        <div className="mt-10 flex items-center justify-center gap-6 text-sm">
          <Link
            href="/dashboard"
            className="text-[var(--ink-1)] hover:text-[var(--ink-3)] transition-colors focus-ring rounded-md"
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="text-[var(--ink-1)] hover:text-[var(--ink-3)] transition-colors focus-ring rounded-md"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="text-[var(--ink-1)] hover:text-[var(--ink-3)] transition-colors focus-ring rounded-md"
          >
            Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
