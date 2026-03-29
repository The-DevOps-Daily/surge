import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - SaaS App",
  description: "Terms of Service for SaaS App. Read about service usage, accounts, payments, and more.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[128px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
        <Link href="/landing" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold text-gray-100">SaaS App</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2">Log in</Link>
          <Link href="/register" className="text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200">
            Start Free
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-12 pb-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Terms of Service
          </span>
        </h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 2026</p>

        <div className="space-y-8 text-gray-400 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">1. Service Description</h2>
            <p>
              SaaS App (&quot;the Service&quot;) is a web application. The Service is provided by
              SaaS App (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) and is available at your-app.com.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">2. User Accounts and Responsibilities</h2>
            <p className="mb-3">
              To use the Service, you must create an account by providing a valid email address and password.
              You are responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activity that occurs under your account</li>
              <li>Ensuring that the information you provide is accurate and up to date</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="mt-3">
              You must be at least 18 years old to use the Service. We reserve the right to suspend or
              terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">3. Payment and Subscriptions</h2>
            <p className="mb-3">
              The Service offers both free and paid subscription plans. Paid plans are billed monthly
              through Stripe, our payment processor.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Subscriptions renew automatically at the end of each billing cycle</li>
              <li>You may cancel your subscription at any time from your account settings</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>No refunds are provided for partial billing periods</li>
              <li>We reserve the right to change pricing with 30 days advance notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">4. Data Ownership</h2>
            <p>
              You retain full ownership of any data you enter into the Service. We do not claim any
              intellectual property rights over your financial data. You may export your data at any time
              (available on paid plans) or request a full data export by contacting support.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">5. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Reverse-engineer, decompile, or disassemble any part of the Service</li>
              <li>Use automated tools to scrape or access the Service</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">6. Limitation of Liability</h2>
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind, express or implied. We do
              not guarantee the accuracy of any financial calculations, projections, or recommendations
              provided by the Service. The Service is not a substitute for professional financial advice.
            </p>
            <p className="mt-3">
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">7. Termination</h2>
            <p>
              We may terminate or suspend your access to the Service at any time, with or without cause,
              with or without notice. Upon termination, your right to use the Service will cease immediately.
              You may request export of your data within 30 days of termination.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">8. Changes to These Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of material
              changes via email or through the Service. Your continued use of the Service after changes
              are posted constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">9. Contact</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:support@your-app.com" className="text-emerald-400 hover:underline">
                support@your-app.com
              </a>.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} SaaS App</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/landing" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
            <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
