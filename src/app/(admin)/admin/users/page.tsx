"use client";

import { useEffect, useState, useCallback } from "react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";

interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  tier: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserDetail extends UserRecord {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  tierExpiresAt: string | null;
  onboarded: boolean;
}

function tierBadgeClass(tier: string) {
  if (tier === "pro")
    return "bg-[var(--warn-soft)] text-[var(--warn)]";
  if (tier === "family")
    return "bg-[var(--accent-soft)] text-[var(--accent)]";
  return "bg-[var(--surface-2)] text-[var(--ink-1)] border border-[var(--line-1)]";
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[var(--line-1)] last:border-0">
      <span className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
        {label}
      </span>
      <span className="text-sm text-[var(--ink-3)] font-medium text-right break-all max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

export default function AdminUsersPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [pendingDisableId, setPendingDisableId] = useState<string | null>(null);
  const [disablingId, setDisablingId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
    });
    if (search) params.set("search", search);
    if (tierFilter !== "all") params.set("tier", tierFilter);

    fetch(`/api/admin/users?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, search, tierFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTierChange = async (userId: string, newTier: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: newTier }),
    });
    if (res.ok) {
      addToast(`Tier updated to ${newTier}`);
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, tier: newTier });
      }
      fetchUsers();
    } else {
      addToast("Failed to update tier", "error");
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      addToast(`Role updated to ${newRole}`);
      fetchUsers();
    } else {
      addToast("Failed to update role", "error");
    }
  };

  const handleDisableConfirm = async () => {
    if (!pendingDisableId) return;
    setDisablingId(pendingDisableId);
    const res = await fetch(`/api/admin/users/${pendingDisableId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      addToast("Account disabled");
      fetchUsers();
    } else {
      addToast("Failed to disable account", "error");
    }
    setPendingDisableId(null);
    setDisablingId(null);
  };

  const handleViewDetails = async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`);
    if (res.ok) {
      const data = await res.json();
      setSelectedUser(data);
      setShowDetail(true);
    } else {
      addToast("Failed to load user details", "error");
    }
  };

  const handleSyncStripe = async () => {
    if (!selectedUser) return;
    setSyncing(true);
    const res = await fetch(
      `/api/admin/users/${selectedUser.id}/sync-stripe`,
      { method: "POST" },
    );
    if (res.ok) {
      const data = await res.json();
      addToast(
        `Synced from Stripe. Tier: ${data.tier}${data.tierExpiresAt ? `, expires ${new Date(data.tierExpiresAt).toLocaleDateString()}` : ""}`,
      );
      await handleViewDetails(selectedUser.id);
      fetchUsers();
    } else {
      addToast("Sync failed — user may not have a Stripe subscription", "error");
    }
    setSyncing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
          User management
        </h1>
        <p className="text-sm text-[var(--ink-1)] mt-1.5">
          Manage users, tiers, and roles.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search users"
          />
        </div>
        <div className="sm:w-44">
          <Select
            value={tierFilter}
            onChange={(e) => {
              setTierFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by tier"
            options={[
              { value: "all", label: "All tiers" },
              { value: "free", label: "Free" },
              { value: "pro", label: "Pro" },
              { value: "family", label: "Family" },
            ]}
          />
        </div>
      </div>

      <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--line-1)]">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Email</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Name</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Tier</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Role</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)]">Signed up</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] text-[var(--ink-1)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--ink-1)]">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--ink-1)]">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[var(--line-1)] last:border-0 hover:bg-[var(--surface-2)]/50 transition-colors"
                  >
                    <td className="px-6 py-3 text-[var(--ink-3)] font-medium">
                      {user.email}
                    </td>
                    <td className="px-6 py-3 text-[var(--ink-2)]">
                      {user.name || "-"}
                    </td>
                    <td className="px-6 py-3">
                      <select
                        value={user.tier}
                        onChange={(e) =>
                          handleTierChange(user.id, e.target.value)
                        }
                        className="bg-[var(--surface-2)] border border-[var(--line-1)] rounded-[8px] px-2 py-1 text-xs text-[var(--ink-2)] focus-ring focus:border-[var(--warn)] transition-colors"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="family">Family</option>
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        className={`text-[11px] px-2 h-6 rounded-full font-medium transition-colors focus-ring ${
                          user.role === "admin"
                            ? "bg-[var(--warn-soft)] text-[var(--warn)] hover:bg-[var(--warn)]/20"
                            : "bg-[var(--surface-2)] text-[var(--ink-1)] border border-[var(--line-1)] hover:bg-[var(--surface-3)]"
                        }`}
                      >
                        {user.role}
                      </button>
                    </td>
                    <td className="px-6 py-3 text-[var(--ink-1)] tabular-nums">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3 justify-end">
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="text-xs text-[var(--ink-3)] hover:text-[var(--warn)] transition-colors focus-ring rounded-md"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setPendingDisableId(user.id)}
                          className="text-xs text-[var(--danger)] hover:opacity-80 transition-opacity focus-ring rounded-md"
                        >
                          Disable
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
        isOpen={showDetail && !!selectedUser}
        onClose={() => setShowDetail(false)}
        title="User details"
        description={selectedUser?.email}
        size="md"
      >
        {selectedUser && (
          <>
            <div className="space-y-0">
              <DetailRow label="Email" value={selectedUser.email} />
              <DetailRow label="Name" value={selectedUser.name || "-"} />
              <DetailRow
                label="Tier"
                value={
                  <span
                    className={`inline-flex items-center text-[11px] px-2 h-5 rounded-full font-medium ${tierBadgeClass(selectedUser.tier)}`}
                  >
                    {selectedUser.tier.charAt(0).toUpperCase() +
                      selectedUser.tier.slice(1)}
                  </span>
                }
              />
              <DetailRow
                label="Role"
                value={
                  selectedUser.role.charAt(0).toUpperCase() +
                  selectedUser.role.slice(1)
                }
              />
              <DetailRow
                label="Onboarded"
                value={selectedUser.onboarded ? "Yes" : "No"}
              />
              <DetailRow
                label="Stripe customer"
                value={
                  selectedUser.stripeCustomerId ? (
                    <a
                      href={`https://dashboard.stripe.com/test/customers/${selectedUser.stripeCustomerId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--warn)] hover:underline underline-offset-4 font-mono text-xs"
                    >
                      {selectedUser.stripeCustomerId}
                    </a>
                  ) : (
                    <span className="text-[var(--ink-1)]">Not connected</span>
                  )
                }
              />
              <DetailRow
                label="Subscription"
                value={
                  selectedUser.stripeSubscriptionId ? (
                    <span className="font-mono text-xs">
                      {selectedUser.stripeSubscriptionId}
                    </span>
                  ) : (
                    <span className="text-[var(--ink-1)]">None</span>
                  )
                }
              />
              <DetailRow
                label="Tier expires"
                value={
                  selectedUser.tierExpiresAt
                    ? new Date(selectedUser.tierExpiresAt).toLocaleDateString()
                    : "N/A"
                }
              />
              <DetailRow
                label="Signed up"
                value={new Date(selectedUser.createdAt).toLocaleString()}
              />
              <DetailRow
                label="Last updated"
                value={new Date(selectedUser.updatedAt).toLocaleString()}
              />
            </div>

            <div className="mt-6 pt-5 border-t border-[var(--line-1)] flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSyncStripe}
                loading={syncing}
                disabled={!selectedUser.stripeSubscriptionId}
              >
                Sync from Stripe
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={() => handleTierChange(selectedUser.id, "pro")}
              >
                Set Pro
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTierChange(selectedUser.id, "free")}
              >
                Set Free
              </Button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!pendingDisableId}
        onClose={() => setPendingDisableId(null)}
        onConfirm={handleDisableConfirm}
        title="Disable account?"
        description="The user will lose access immediately. You can re-enable from the database."
        confirmText="Disable account"
        tone="danger"
        loading={!!disablingId}
      />
    </div>
  );
}
