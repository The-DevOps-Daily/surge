import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[var(--surface-0)] relative">
      <AdminSidebar />
      <main className="flex-1 pb-24 md:pb-0 relative z-10">
        <div className="max-w-6xl mx-auto p-4 md:p-8">{children}</div>
      </main>
      <AdminMobileNav />
    </div>
  );
}
