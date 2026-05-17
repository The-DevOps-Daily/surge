/**
 * Canonical admin list page.
 *
 * Copy to: src/app/(admin)/admin/<your-resource>/page.tsx
 * Pair with: src/app/api/admin/<your-resource>/route.ts (see admin-api-route.ts).
 *
 * Pattern:
 *   - Search + filter + pagination controls at the top.
 *   - Token-driven table (no hardcoded colors).
 *   - Detail modal via the shared Modal primitive.
 *   - Destructive actions go through ConfirmDialog, not window.confirm().
 *   - All toasts via useToast().
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";

interface Row {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

export default function AdminResourcePage() {
  const { addToast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Row | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);

    fetch(`/api/admin/your-resource?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data.rows || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/your-resource/${pendingDelete}`, {
      method: "DELETE",
    });
    if (res.ok) {
      addToast("Deleted");
      fetchRows();
    } else {
      addToast("Failed to delete", "error");
    }
    setPendingDelete(null);
    setDeleting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
          Resource management
        </h1>
        <p className="text-sm text-[var(--ink-1)] mt-1.5">
          One-line description of what this page is for.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search"
          />
        </div>
        <div className="sm:w-44">
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
            options={[
              { value: "all", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "paused", label: "Paused" },
            ]}
          />
        </div>
      </div>

      <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--line-1)]">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Name</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Created</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--ink-1)]">Loading...</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--ink-1)]">No rows.</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[var(--line-1)] last:border-0 hover:bg-[var(--surface-2)]/50 transition-colors"
                  >
                    <td className="px-6 py-3 text-[var(--ink-3)] font-medium">{row.name}</td>
                    <td className="px-6 py-3 text-[var(--ink-2)]">{row.status}</td>
                    <td className="px-6 py-3 text-[var(--ink-1)] tabular-nums">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3 justify-end">
                        <button
                          onClick={() => setSelected(row)}
                          className="text-xs text-[var(--ink-3)] hover:text-[var(--accent)] transition-colors focus-ring rounded-md"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setPendingDelete(row.id)}
                          className="text-xs text-[var(--danger)] hover:opacity-80 transition-opacity focus-ring rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--line-1)]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-[var(--ink-1)] tabular-nums">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || "Detail"}
        size="md"
      >
        {selected && (
          <pre className="text-xs text-[var(--ink-1)] bg-[var(--surface-2)] border border-[var(--line-1)] rounded-[12px] p-4 overflow-x-auto">
            {JSON.stringify(selected, null, 2)}
          </pre>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title="Delete this row?"
        description="This is permanent and cannot be undone."
        confirmText="Delete"
        tone="danger"
        loading={deleting}
      />
    </div>
  );
}
