import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0f]">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-6">🔍</p>
        <h1 className="text-4xl font-bold text-gray-100 mb-3">404</h1>
        <p className="text-lg text-gray-400 mb-8">
          Page not found. The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 min-h-[44px]"
          >
            Go back home
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-6 text-sm">
          <Link href="/" className="text-emerald-400 hover:underline">
            Dashboard
          </Link>
          <Link href="/settings" className="text-emerald-400 hover:underline">
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
