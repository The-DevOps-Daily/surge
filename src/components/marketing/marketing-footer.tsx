import Link from 'next/link';

const sections: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/compare", label: "Compare" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Free tools",
    links: [{ href: "/tools/sample-tool", label: "Growth calculator" }],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Create account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--line-1)] mt-16 bg-[var(--surface-0)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--ink-1)] mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--ink-2)] hover:text-[var(--ink-3)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--line-1)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[7px] bg-[var(--ink-3)] text-[var(--surface-0)] flex items-center justify-center">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2 2 22h20L12 2z" />
              </svg>
            </div>
            <span className="text-sm text-[var(--ink-2)]">SaaS App</span>
          </div>
          <p className="text-xs text-[var(--ink-1)]">
            &copy; {new Date().getFullYear()} SaaS App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
