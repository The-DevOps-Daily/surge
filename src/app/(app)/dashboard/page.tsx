'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session } = useSession();
  const [tier, setTier] = useState<string>("free");
  const [upgradeDismissed, setUpgradeDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/user/tier")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data?.tier) setTier(data.tier); })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Upgrade CTA for free users */}
      {tier === "free" && !upgradeDismissed && (
        <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <span className="text-lg">✨</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200">Unlock Pro features</p>
            <p className="text-xs text-gray-500">Get unlimited access, advanced features, and priority support.</p>
          </div>
          <Link
            href="/billing?plan=pro"
            className="flex-shrink-0 px-4 py-2 text-xs font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-400 transition-colors"
          >
            Upgrade
          </Link>
          <button
            onClick={() => setUpgradeDismissed(true)}
            className="flex-shrink-0 text-gray-600 hover:text-gray-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-100">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
        </h1>
        <p className="text-gray-400 mt-1">Your dashboard</p>
      </div>

      {/* Add your dashboard widgets here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6">
          <h3 className="text-sm font-medium text-gray-400">Widget 1</h3>
          <p className="text-2xl font-bold text-gray-100 mt-2">--</p>
        </div>
        <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6">
          <h3 className="text-sm font-medium text-gray-400">Widget 2</h3>
          <p className="text-2xl font-bold text-gray-100 mt-2">--</p>
        </div>
        <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-6">
          <h3 className="text-sm font-medium text-gray-400">Widget 3</h3>
          <p className="text-2xl font-bold text-gray-100 mt-2">--</p>
        </div>
      </div>
    </div>
  );
}
