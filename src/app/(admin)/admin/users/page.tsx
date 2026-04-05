"use client";

import { useEffect, useState, useCallback } from "react";

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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);

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
    await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: newTier }),
    });
    fetchUsers();
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  };

  const handleDisable = async (userId: string) => {
    if (!confirm("Are you sure you want to disable this account?")) return;
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleViewDetails = async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`);
    if (res.ok) {
      const data = await res.json();
      setSelectedUser(data);
      setShowDetail(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage users, tiers, and roles
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
        <select
          value={tierFilter}
          onChange={(e) => {
            setTierFilter(e.target.value);
            setPage(1);
          }}
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-violet-500/50 transition-colors"
        >
          <option value="all">All Tiers</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="family">Family</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-white/[0.06]">
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Tier</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Signed Up</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {user.name || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.tier}
                        onChange={(e) =>
                          handleTierChange(user.id, e.target.value)
                        }
                        className="bg-white/[0.06] border border-white/[0.1] rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-violet-500/50"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="family">Family</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                          user.role === "admin"
                            ? "bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
                            : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                        }`}
                      >
                        {user.role}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDisable(user.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-gray-400 hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm text-gray-400 hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showDetail && selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-[#12121a] border border-white/[0.08] rounded-2xl w-full max-w-lg p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-100">
                User Details
              </h2>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <DetailRow label="Email" value={selectedUser.email} />
              <DetailRow label="Name" value={selectedUser.name || "-"} />
              <DetailRow
                label="Tier"
                value={
                  selectedUser.tier.charAt(0).toUpperCase() +
                  selectedUser.tier.slice(1)
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
                label="Stripe Customer"
                value={selectedUser.stripeCustomerId || "Not connected"}
              />
              {selectedUser.stripeCustomerId && (
                <div className="flex justify-end -mt-2 mb-1">
                  <a
                    href={`https://dashboard.stripe.com/test/customers/${selectedUser.stripeCustomerId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    View in Stripe &rarr;
                  </a>
                </div>
              )}
              <DetailRow
                label="Subscription"
                value={selectedUser.stripeSubscriptionId || "None"}
              />
              <DetailRow
                label="Tier Expires"
                value={
                  selectedUser.tierExpiresAt
                    ? new Date(selectedUser.tierExpiresAt).toLocaleDateString()
                    : "N/A"
                }
              />
              <DetailRow
                label="Signed Up"
                value={new Date(selectedUser.createdAt).toLocaleString()}
              />
              <DetailRow
                label="Last Updated"
                value={new Date(selectedUser.updatedAt).toLocaleString()}
              />
            </div>

            {/* Admin actions */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap gap-2">
              <button
                onClick={async () => {
                  const res = await fetch(`/api/admin/users/${selectedUser.id}/sync-stripe`, { method: "POST" });
                  if (res.ok) {
                    const data = await res.json();
                    alert(`Synced! Tier: ${data.tier}, Expires: ${data.tierExpiresAt || "N/A"}`);
                    handleViewDetails(selectedUser.id);
                    fetchUsers();
                  } else {
                    alert("Sync failed - user may not have a Stripe subscription");
                  }
                }}
                disabled={!selectedUser.stripeSubscriptionId}
                className="text-xs px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sync from Stripe
              </button>
              <button
                onClick={() => {
                  handleTierChange(selectedUser.id, "pro");
                  setSelectedUser({ ...selectedUser, tier: "pro" });
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
              >
                Set Pro
              </button>
              <button
                onClick={() => {
                  handleTierChange(selectedUser.id, "free");
                  setSelectedUser({ ...selectedUser, tier: "free" });
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
              >
                Set Free
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-300 font-medium">{value}</span>
    </div>
  );
}
