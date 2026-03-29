"use client";

import { useEffect, useState } from "react";

interface SystemHealth {
  services: {
    database: { status: string; provider: string; size: string };
    stripe: { status: string };
    email: { status: string };
    registration: { status: string };
  };
  system: {
    runtime: string;
    environment: string;
    uptime: string;
    totalUsers: number;
  };
  envVars: Record<string, boolean | string | undefined>;
}

export default function AdminSystemPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/system")
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Loading system info...</div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-400">Failed to load system health.</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">System Health</h1>
        <p className="text-sm text-gray-500 mt-1">
          Service status and environment info
        </p>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          label="Database"
          status={health.services.database.status}
          detail={health.services.database.provider}
          goodValues={["connected"]}
        />
        <StatusCard
          label="Stripe"
          status={health.services.stripe.status}
          goodValues={["configured"]}
        />
        <StatusCard
          label="Email (Resend)"
          status={health.services.email.status}
          goodValues={["configured"]}
        />
        <StatusCard
          label="Registration"
          status={health.services.registration.status}
          goodValues={["enabled"]}
        />
      </div>

      {/* System Info */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">
          System Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Runtime" value={health.system.runtime} />
          <InfoRow label="Environment" value={health.system.environment} />
          <InfoRow
            label="Database Provider"
            value={health.services.database.provider}
          />
          <InfoRow
            label="Database Size"
            value={health.services.database.size}
          />
          <InfoRow label="Uptime" value={health.system.uptime} />
          <InfoRow
            label="Total Users"
            value={String(health.system.totalUsers)}
          />
        </div>
      </div>

      {/* Environment Variables */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">
          Environment Variables
        </h2>
        <div className="space-y-2">
          {Object.entries(health.envVars).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between py-2 border-b border-white/[0.04]"
            >
              <code className="text-sm text-gray-400 font-mono">{key}</code>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  value === true || (typeof value === "string" && value !== "")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {value === true || (typeof value === "string" && value !== "")
                  ? "Configured"
                  : "Missing"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  label,
  status,
  detail,
  goodValues,
}: {
  label: string;
  status: string;
  detail?: string;
  goodValues: string[];
}) {
  const isGood = goodValues.includes(status);
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isGood ? "bg-emerald-400 animate-pulse-glow" : "bg-rose-400"
          }`}
        />
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p
        className={`text-lg font-semibold capitalize ${
          isGood ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        {status}
      </p>
      {detail && <p className="text-xs text-gray-500 mt-1">{detail}</p>}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-300 font-medium">{value}</span>
    </div>
  );
}
