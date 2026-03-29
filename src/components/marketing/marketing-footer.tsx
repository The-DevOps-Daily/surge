import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] mt-12 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Pricing</Link></li>
              <li><Link href="/compare" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Compare</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Blog</Link></li>
            </ul>
          </div>
          {/* Free Tools */}
          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-4">Free Tools</h4>
            <ul className="space-y-2">
              <li><Link href="/tools/sample-tool" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Growth Calculator</Link></li>
            </ul>
          </div>
          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Login</Link></li>
              <li><Link href="/register" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Register</Link></li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-sm text-gray-500">SaaS App</span>
          </div>
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} SaaS App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
