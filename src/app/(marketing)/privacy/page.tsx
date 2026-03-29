import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - SaaS App",
  description: "Privacy Policy for SaaS App. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </span>
        </h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 2026</p>

        <div className="space-y-8 text-gray-400 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">1. What Data We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-gray-200">Account information:</strong> your name, email address, and hashed password when you create an account</li>
              <li><strong className="text-gray-200">Financial data:</strong> asset values, liability amounts, income streams, and snapshots that you manually enter</li>
              <li><strong className="text-gray-200">Usage data:</strong> basic analytics about how you use the Service, such as page views and feature usage</li>
              <li><strong className="text-gray-200">Payment data:</strong> if you subscribe to a paid plan, payment information is collected and processed by Stripe; we do not store your credit card details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">2. How We Use Your Data</h2>
            <p className="mb-3">Your data is used to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide and maintain the Service</li>
              <li>Calculate and display your data, reports, and summaries</li>
              <li>Process your subscription payments</li>
              <li>Send important account notifications (such as subscription changes)</li>
              <li>Improve the Service based on aggregate usage patterns</li>
            </ul>
            <p className="mt-3">
              We never sell your personal or financial data to third parties. We never use your financial
              data for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">3. Data Storage and Security</h2>
            <p>
              Your data is stored securely with encryption in transit (TLS/SSL). We follow industry
              best practices for securing web applications. Access to production data is restricted to
              authorized personnel only.
            </p>
            <p className="mt-3">
              While we take reasonable measures to protect your data, no method of transmission or
              storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-gray-200">Stripe:</strong> for payment processing. Stripe collects and processes your payment information according to their own privacy policy. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">stripe.com/privacy</a>.</li>
              <li><strong className="text-gray-200">Authentication:</strong> we use secure session-based authentication. Passwords are hashed and never stored in plain text.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">5. Data Export and Deletion</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-gray-200">Export your data:</strong> paid plan users can export all their data in CSV or JSON format from the settings page. Free plan users can request an export by contacting support.</li>
              <li><strong className="text-gray-200">Delete your account:</strong> you can delete your account from the settings page or by contacting us at support@your-app.com. All your data will be permanently deleted within 30 days of your request.</li>
              <li><strong className="text-gray-200">Access your data:</strong> you can view all data you have entered through the Service at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">6. Cookies</h2>
            <p>
              We use essential cookies to maintain your login session and remember your preferences.
              We do not use tracking cookies or third-party advertising cookies. Session cookies are
              automatically deleted when you close your browser or sign out.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              Your continued use of the Service after changes are posted constitutes your acceptance
              of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">8. Contact</h2>
            <p>
              If you have questions about this Privacy Policy or your data, please contact us at{" "}
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
