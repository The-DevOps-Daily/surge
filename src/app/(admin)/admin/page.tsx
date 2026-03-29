"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AdminStats {
  totalUsers: number;
  userGrowth: number;
  proSubscribers: number;
  familySubscribers: number;
  mrr: number;
  signupsByDay: { date: string; count: number }[];
  tierDistribution: { name: string; value: number }[];
  recentSignups: {
    id: string;
    email: string;
    name: string | null;
    tier: string;
    createdAt: string;
  }[];
}

const PIE_COLORS = ["#6b7280", "#8b5cf6", "#a78bfa"];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Loading stats...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-400">Failed to load admin stats.</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your SaaS platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          growth={stats.userGrowth}
        />
        <StatCard label="Pro Subscribers" value={stats.proSubscribers} />
        <StatCard label="Family Subscribers" value={stats.familySubscribers} />
        <StatCard
          label="MRR"
          value={`$${stats.mrr.toFixed(2)}`}
          isCurrency
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signups Bar Chart */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">
            User Signups (Last 30 Days)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.signupsByDay}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#e5e7eb",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier Distribution Pie Chart */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">
            Tier Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.tierDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {stats.tierDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#e5e7eb",
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Signups */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">
          Recent Signups
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-white/[0.06]">
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Tier</th>
                <th className="pb-3 font-medium">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSignups.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 text-gray-300">{user.email}</td>
                  <td className="py-3 text-gray-400">{user.name || "-"}</td>
                  <td className="py-3">
                    <TierBadge tier={user.tier} />
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {stats.recentSignups.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  growth,
  isCurrency,
}: {
  label: string;
  value: number | string;
  growth?: number;
  isCurrency?: boolean;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-end gap-2 mt-2">
        <p className="text-2xl font-bold text-gray-100">
          {typeof value === "number" && !isCurrency
            ? value.toLocaleString()
            : value}
        </p>
        {growth !== undefined && (
          <span
            className={`text-xs font-medium mb-1 ${growth >= 0 ? "text-emerald-400" : "text-rose-400"}`}
          >
            {growth >= 0 ? "+" : ""}
            {growth}%
          </span>
        )}
      </div>
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    free: "bg-gray-500/20 text-gray-400",
    pro: "bg-violet-500/20 text-violet-400",
    family: "bg-purple-500/20 text-purple-400",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[tier] || colors.free}`}
    >
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}
