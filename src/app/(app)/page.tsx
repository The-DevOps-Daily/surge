'use client';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
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
