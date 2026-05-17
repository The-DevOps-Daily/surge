import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { getAllDocs } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = getAllDocs().map((d) => ({
    slug: d.slug,
    title: d.title,
    description: d.description,
  }));

  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-3)] relative overflow-hidden flex flex-col">
      <div className="bg-mesh" />

      <MarketingNav />

      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-8">
          <DocsSidebar docs={docs} />
          <div className="min-w-0">{children}</div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
