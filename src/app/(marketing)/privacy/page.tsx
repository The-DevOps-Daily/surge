import { LegalPage, LegalSection } from "@/components/marketing/legal-page";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Privacy Policy",
  description:
    "Privacy Policy for SaaS App. Learn how we collect, use, and protect your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="March 2026">
      <LegalSection title="1. What data we collect">
        <p className="mb-3">We collect the following types of information:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-[var(--ink-3)]">Account information:</strong>{" "}
            your name, email address, and hashed password when you create an
            account
          </li>
          <li>
            <strong className="text-[var(--ink-3)]">Financial data:</strong>{" "}
            asset values, liability amounts, income streams, and snapshots that
            you manually enter
          </li>
          <li>
            <strong className="text-[var(--ink-3)]">Usage data:</strong> basic
            analytics about how you use the Service, such as page views and
            feature usage
          </li>
          <li>
            <strong className="text-[var(--ink-3)]">Payment data:</strong> if
            you subscribe to a paid plan, payment information is collected and
            processed by Stripe. We do not store your credit card details.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How we use your data">
        <p className="mb-3">Your data is used to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Provide and maintain the Service</li>
          <li>Calculate and display your data, reports, and summaries</li>
          <li>Process your subscription payments</li>
          <li>
            Send important account notifications (such as subscription changes)
          </li>
          <li>Improve the Service based on aggregate usage patterns</li>
        </ul>
        <p className="mt-3">
          We never sell your personal or financial data to third parties. We
          never use your financial data for advertising purposes.
        </p>
      </LegalSection>

      <LegalSection title="3. Data storage and security">
        <p>
          Your data is stored securely with encryption in transit (TLS/SSL). We
          follow industry best practices for securing web applications. Access
          to production data is restricted to authorized personnel only.
        </p>
        <p className="mt-3">
          While we take reasonable measures to protect your data, no method of
          transmission or storage is 100% secure. We cannot guarantee absolute
          security.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-party services">
        <p className="mb-3">We use the following third-party services:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-[var(--ink-3)]">Stripe:</strong> for payment
            processing. Stripe collects and processes your payment information
            according to their own privacy policy. See{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline underline-offset-4"
            >
              stripe.com/privacy
            </a>
            .
          </li>
          <li>
            <strong className="text-[var(--ink-3)]">Authentication:</strong> we
            use secure session-based authentication. Passwords are hashed and
            never stored in plain text.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Data export and deletion">
        <p className="mb-3">You have the right to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-[var(--ink-3)]">Export your data:</strong>{" "}
            paid plan users can export all their data in CSV or JSON format
            from the settings page. Free plan users can request an export by
            contacting support.
          </li>
          <li>
            <strong className="text-[var(--ink-3)]">Delete your account:</strong>{" "}
            you can delete your account from the settings page or by contacting
            us at support@your-app.com. All your data will be permanently
            deleted within 30 days of your request.
          </li>
          <li>
            <strong className="text-[var(--ink-3)]">Access your data:</strong>{" "}
            you can view all data you have entered through the Service at any
            time.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Cookies">
        <p>
          We use essential cookies to maintain your login session and remember
          your preferences. We do not use tracking cookies or third-party
          advertising cookies. Session cookies are automatically deleted when
          you close your browser or sign out.
        </p>
      </LegalSection>

      <LegalSection title="7. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any material changes by posting the new policy on this page
          and updating the &quot;Last updated&quot; date. Your continued use of
          the Service after changes are posted constitutes your acceptance of
          the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          If you have questions about this Privacy Policy or your data, please
          contact us at{" "}
          <a
            href="mailto:support@your-app.com"
            className="text-[var(--accent)] hover:underline underline-offset-4"
          >
            support@your-app.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
