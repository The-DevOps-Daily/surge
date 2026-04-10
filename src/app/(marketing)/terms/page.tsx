import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Terms of Service",
  description: "Terms of Service for SaaS App. Read about service usage, accounts, payments, and more.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[128px]" />
      </div>

      <MarketingNav />

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

      <MarketingFooter />
    </div>
  );
}
