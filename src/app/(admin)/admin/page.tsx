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
  emailSubscribers: number;
  emailSubscriberList: {
    id: string;
    email: string;
    name: string | null;
    tier: string;
  }[];
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

const PIE_COLORS = [
  "var(--surface-3)",
  "var(--warn)",
  "var(--ink-3)",
  "var(--accent)",
];

function tierClass(tier: string) {
  if (tier === "pro")
    return "bg-[var(--warn-soft)] text-[var(--warn)]";
  if (tier === "family")
    return "bg-[var(--accent-soft)] text-[var(--accent)]";
  return "bg-[var(--surface-2)] text-[var(--ink-1)] border border-[var(--line-1)]";
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
    <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] p-5">
      <p className="text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
        {label}
      </p>
      <div className="flex items-end gap-2 mt-2">
        <p className="text-2xl font-semibold tracking-[-0.02em] text-[var(--ink-3)] tabular-nums">
          {typeof value === "number" && !isCurrency
            ? value.toLocaleString()
            : value}
        </p>
        {growth !== undefined && (
          <span
            className={`text-xs font-medium mb-1 ${
              growth >= 0 ? "text-[var(--accent)]" : "text-[var(--danger)]"
            }`}
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
  return (
    <span
      className={`inline-flex items-center text-[11px] px-2 h-5 rounded-full font-medium ${tierClass(tier)}`}
    >
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] p-12 text-center">
        <p className="text-sm text-[var(--ink-1)]">Loading stats...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--danger-soft)] p-12 text-center">
        <p className="text-sm text-[var(--danger)] font-medium">
          Failed to load admin stats.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
          Admin dashboard
        </h1>
        <p className="text-sm text-[var(--ink-1)] mt-1.5">
          Overview of your SaaS platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total users"
          value={stats.totalUsers}
          growth={stats.userGrowth}
        />
        <StatCard label="Pro subscribers" value={stats.proSubscribers} />
        <StatCard label="Team subscribers" value={stats.familySubscribers} />
        <StatCard label="MRR" value={`$${stats.mrr.toFixed(2)}`} isCurrency />
        <StatCard label="Email subscribers" value={stats.emailSubscribers || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6">
          <h2 className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium mb-5">
            Signups (last 30 days)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.signupsByDay}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--ink-1)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--ink-1)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--surface-2)" }}
                  contentStyle={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--line-2)",
                    borderRadius: "12px",
                    color: "var(--ink-3)",
                    fontSize: 12,
                    boxShadow: "var(--shadow-2)",
                  }}
                />
                <Bar dataKey="count" fill="var(--warn)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6">
          <h2 className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium mb-5">
            Tier distribution
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
                    background: "var(--surface-2)",
                    border: "1px solid var(--line-2)",
                    borderRadius: "12px",
                    color: "var(--ink-3)",
                    fontSize: 12,
                    boxShadow: "var(--shadow-2)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--line-1)]">
          <h2 className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
            Recent signups
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--ink-1)] border-b border-[var(--line-1)]">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em]">Email</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em]">Name</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em]">Tier</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em]">Signed up</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSignups.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[var(--line-1)] last:border-0 hover:bg-[var(--surface-2)]/50 transition-colors"
                >
                  <td className="px-6 py-3 text-[var(--ink-3)]">{user.email}</td>
                  <td className="px-6 py-3 text-[var(--ink-2)]">{user.name || "-"}</td>
                  <td className="px-6 py-3">
                    <TierBadge tier={user.tier} />
                  </td>
                  <td className="px-6 py-3 text-[var(--ink-1)] tabular-nums">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {stats.recentSignups.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--ink-1)]">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {stats.emailSubscriberList && stats.emailSubscriberList.length > 0 && (
        <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--line-1)]">
            <h2 className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
              Email report subscribers ({stats.emailSubscriberList.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--ink-1)] border-b border-[var(--line-1)]">
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em]">Email</th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em]">Name</th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-[0.05em]">Tier</th>
                </tr>
              </thead>
              <tbody>
                {stats.emailSubscriberList.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-[var(--line-1)] last:border-0"
                  >
                    <td className="px-6 py-3 text-[var(--ink-3)]">{sub.email}</td>
                    <td className="px-6 py-3 text-[var(--ink-2)]">{sub.name || "-"}</td>
                    <td className="px-6 py-3">
                      <TierBadge tier={sub.tier} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
