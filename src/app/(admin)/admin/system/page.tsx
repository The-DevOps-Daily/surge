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
    <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] p-5">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`w-2 h-2 rounded-full ${
            isGood ? "bg-[var(--accent)]" : "bg-[var(--danger)]"
          }`}
        />
        <p className="text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
          {label}
        </p>
      </div>
      <p
        className={`text-lg font-semibold capitalize tracking-[-0.005em] ${
          isGood ? "text-[var(--accent)]" : "text-[var(--danger)]"
        }`}
      >
        {status}
      </p>
      {detail && (
        <p className="text-xs text-[var(--ink-1)] mt-1">{detail}</p>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-[10px] bg-[var(--surface-2)] border border-[var(--line-1)]">
      <span className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium">
        {label}
      </span>
      <span className="text-sm text-[var(--ink-3)] font-medium tabular-nums">
        {value}
      </span>
    </div>
  );
}

export default function AdminSystemPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/system")
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
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
        <p className="text-sm text-[var(--ink-1)]">Loading system info...</p>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--danger-soft)] p-12 text-center">
        <p className="text-sm text-[var(--danger)] font-medium">
          Failed to load system health.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]">
          System health
        </h1>
        <p className="text-sm text-[var(--ink-1)] mt-1.5">
          Service status and environment info.
        </p>
      </div>

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
          label="Email (smtpfa.st)"
          status={health.services.email.status}
          goodValues={["configured"]}
        />
        <StatusCard
          label="Registration"
          status={health.services.registration.status}
          goodValues={["enabled"]}
        />
      </div>

      <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6">
        <h2 className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium mb-4">
          System information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow label="Runtime" value={health.system.runtime} />
          <InfoRow label="Environment" value={health.system.environment} />
          <InfoRow
            label="DB provider"
            value={health.services.database.provider}
          />
          <InfoRow label="DB size" value={health.services.database.size} />
          <InfoRow label="Uptime" value={health.system.uptime} />
          <InfoRow
            label="Total users"
            value={health.system.totalUsers.toLocaleString()}
          />
        </div>
      </div>

      <div className="rounded-[18px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6">
        <h2 className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)] font-medium mb-4">
          Environment variables
        </h2>
        <div className="divide-y divide-[var(--line-1)]">
          {Object.entries(health.envVars).map(([key, value]) => {
            const configured =
              value === true || (typeof value === "string" && value !== "");
            return (
              <div
                key={key}
                className="flex items-center justify-between py-2.5"
              >
                <code className="text-sm text-[var(--ink-2)] font-mono">
                  {key}
                </code>
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] px-2 h-6 rounded-full font-medium ${
                    configured
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "bg-[var(--danger-soft)] text-[var(--danger)]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      configured ? "bg-[var(--accent)]" : "bg-[var(--danger)]"
                    }`}
                  />
                  {configured ? "Configured" : "Missing"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
