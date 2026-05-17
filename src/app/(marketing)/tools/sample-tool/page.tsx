"use client";

import { useState } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ControlProps {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}

function Control({ label, value, min, max, step, current, onChange }: ControlProps) {
  return (
    <div className="rounded-[16px] border border-[var(--line-1)] bg-[var(--surface-1)] p-5">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-[var(--ink-1)]">
          {label}
        </label>
        <span className="text-base font-semibold text-[var(--ink-3)] tabular-nums">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        aria-label={label}
      />
    </div>
  );
}

export default function SampleToolPage() {
  const [value, setValue] = useState(1000);
  const [growth, setGrowth] = useState(8);
  const [years, setYears] = useState(10);

  const data = Array.from({ length: years }, (_, i) => {
    const year = i + 1;
    const total = value * Math.pow(1 + growth / 100, year);
    return { year: `Y${year}`, value: Math.round(total) };
  });

  const finalValue = data[data.length - 1]?.value ?? 0;
  const totalGrowth = (((finalValue || 0) / value - 1) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-3)] relative overflow-hidden">
      <div className="bg-mesh" />

      <MarketingNav />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <span className="inline-flex items-center h-7 px-3 rounded-full border border-[var(--line-1)] bg-[var(--surface-1)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-1)]">
            Free tool
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[var(--ink-3)]">
            Growth Calculator
          </h1>
          <p className="mt-3 text-[var(--ink-1)] max-w-2xl leading-relaxed">
            Calculate projected growth at a given annual rate. Adjust the
            sliders to see how your starting amount compounds over time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Control
            label="Starting value"
            value={`$${value.toLocaleString()}`}
            min={100}
            max={50000}
            step={100}
            current={value}
            onChange={setValue}
          />
          <Control
            label="Annual growth"
            value={`${growth}%`}
            min={1}
            max={30}
            step={1}
            current={growth}
            onChange={setGrowth}
          />
          <Control
            label="Years"
            value={`${years}`}
            min={1}
            max={30}
            step={1}
            current={years}
            onChange={setYears}
          />
        </div>

        <div className="rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6 mb-6 shadow-[var(--shadow-1)]">
          <h2 className="text-sm font-medium text-[var(--ink-1)] uppercase tracking-[0.06em] mb-5">
            Projected growth
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--line-1)"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "var(--ink-1)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--line-1)" }}
                />
                <YAxis
                  tick={{ fill: "var(--ink-1)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--line-1)" }}
                  tickFormatter={(v) =>
                    v >= 1000000
                      ? `$${(v / 1000000).toFixed(1)}M`
                      : `$${(v / 1000).toFixed(0)}K`
                  }
                />
                <Tooltip
                  cursor={{ fill: "var(--surface-2)" }}
                  contentStyle={{
                    backgroundColor: "var(--surface-2)",
                    border: "1px solid var(--line-2)",
                    borderRadius: "12px",
                    color: "var(--ink-3)",
                    fontSize: "12px",
                    boxShadow: "var(--shadow-2)",
                  }}
                  formatter={(v) => [`$${Number(v).toLocaleString()}`, "Value"]}
                />
                <Bar dataKey="value" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-[16px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6">
            <p className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)]">
              Final value
            </p>
            <p className="text-3xl font-semibold tracking-[-0.02em] text-[var(--ink-3)] mt-2 tabular-nums">
              ${finalValue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-[16px] border border-[var(--line-1)] bg-[var(--surface-1)] p-6">
            <p className="text-xs uppercase tracking-[0.06em] text-[var(--ink-1)]">
              Total growth
            </p>
            <p className="text-3xl font-semibold tracking-[-0.02em] text-[var(--accent)] mt-2 tabular-nums">
              {totalGrowth}%
            </p>
          </div>
        </div>

        <div className="rounded-[20px] border border-[var(--line-1)] bg-[var(--surface-1)] p-8 text-center shadow-[var(--shadow-1)]">
          <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--ink-3)] mb-2">
            Want more powerful tools?
          </h2>
          <p className="text-sm text-[var(--ink-1)] mb-6">
            Sign up for free and get access to the full dashboard.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center h-11 px-6 rounded-[12px] bg-[var(--ink-3)] text-[var(--surface-0)] text-sm font-medium hover:opacity-90 transition-opacity focus-ring"
          >
            Get started for free
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
