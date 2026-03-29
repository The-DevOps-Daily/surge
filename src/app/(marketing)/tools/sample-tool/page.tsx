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

export default function SampleToolPage() {
  const [value, setValue] = useState(1000);
  const [growth, setGrowth] = useState(8);
  const [years, setYears] = useState(10);

  const data = Array.from({ length: years }, (_, i) => {
    const year = i + 1;
    const total = value * Math.pow(1 + growth / 100, year);
    return {
      year: `Year ${year}`,
      value: Math.round(total),
    };
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <MarketingNav />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">
          Growth Calculator
        </h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          This is a sample free tool. Use interactive tools like this to attract
          visitors and convert them into users. Customize or replace it with
          something relevant to your product.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Starting Value ($)
            </label>
            <input
              type="range"
              min={100}
              max={50000}
              step={100}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <p className="text-xl font-bold text-gray-100 mt-1">
              ${value.toLocaleString()}
            </p>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Annual Growth (%)
            </label>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={growth}
              onChange={(e) => setGrowth(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <p className="text-xl font-bold text-gray-100 mt-1">{growth}%</p>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Years
            </label>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <p className="text-xl font-bold text-gray-100 mt-1">
              {years} years
            </p>
          </div>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Projected Growth
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickFormatter={(v) =>
                    v >= 1000000
                      ? `$${(v / 1000000).toFixed(1)}M`
                      : `$${(v / 1000).toFixed(0)}K`
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#f3f4f6",
                  }}
                  formatter={(v) => [`$${Number(v).toLocaleString()}`, "Value"]}
                />
                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Final Value</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                ${data[data.length - 1]?.value.toLocaleString() || "0"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Growth</p>
              <p className="text-3xl font-bold text-emerald-400">
                {(((data[data.length - 1]?.value || 0) / value - 1) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-emerald-500/[0.08] to-teal-500/[0.05] backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-100 mb-2">
            Want more powerful tools?
          </h2>
          <p className="text-gray-400 mb-4">
            Sign up for free and get access to the full dashboard.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
