import { LegalPage, LegalSection } from "@/components/marketing/legal-page";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Terms of Service",
  description:
    "Terms of Service for SaaS App. Read about service usage, accounts, payments, and more.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="March 2026">
      <LegalSection title="1. Service description">
        <p>
          SaaS App (&quot;the Service&quot;) is a web application. The Service
          is provided by SaaS App (&quot;we&quot;, &quot;us&quot;,
          &quot;our&quot;) and is available at your-app.com.
        </p>
      </LegalSection>

      <LegalSection title="2. User accounts and responsibilities">
        <p className="mb-3">
          To use the Service, you must create an account by providing a valid
          email address and password. You are responsible for:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activity that occurs under your account</li>
          <li>
            Ensuring that the information you provide is accurate and up to
            date
          </li>
          <li>
            Notifying us immediately of any unauthorized use of your account
          </li>
        </ul>
        <p className="mt-3">
          You must be at least 18 years old to use the Service. We reserve the
          right to suspend or terminate accounts that violate these terms.
        </p>
      </LegalSection>

      <LegalSection title="3. Payment and subscriptions">
        <p className="mb-3">
          The Service offers both free and paid subscription plans. Paid plans
          are billed monthly through Stripe, our payment processor.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Subscriptions renew automatically at the end of each billing cycle</li>
          <li>You may cancel your subscription at any time from your account settings</li>
          <li>Cancellation takes effect at the end of the current billing period</li>
          <li>No refunds are provided for partial billing periods</li>
          <li>We reserve the right to change pricing with 30 days advance notice</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Data ownership">
        <p>
          You retain full ownership of any data you enter into the Service. We
          do not claim any intellectual property rights over your financial
          data. You may export your data at any time (available on paid plans)
          or request a full data export by contacting support.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable use">
        <p className="mb-3">You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Use the Service for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to any part of the Service</li>
          <li>Reverse-engineer, decompile, or disassemble any part of the Service</li>
          <li>Use automated tools to scrape or access the Service</li>
          <li>Share your account credentials with others</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Limitation of liability">
        <p>
          The Service is provided &quot;as is&quot; without warranties of any
          kind, express or implied. We do not guarantee the accuracy of any
          financial calculations, projections, or recommendations provided by
          the Service. The Service is not a substitute for professional
          financial advice.
        </p>
        <p className="mt-3">
          To the maximum extent permitted by law, we shall not be liable for
          any indirect, incidental, special, consequential, or punitive
          damages, or any loss of profits or revenues, whether incurred
          directly or indirectly.
        </p>
      </LegalSection>

      <LegalSection title="7. Termination">
        <p>
          We may terminate or suspend your access to the Service at any time,
          with or without cause, with or without notice. Upon termination,
          your right to use the Service will cease immediately. You may request
          export of your data within 30 days of termination.
        </p>
      </LegalSection>

      <LegalSection title="8. Changes to these terms">
        <p>
          We reserve the right to modify these terms at any time. We will
          notify users of material changes via email or through the Service.
          Your continued use of the Service after changes are posted
          constitutes your acceptance of the revised terms.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact">
        <p>
          If you have questions about these Terms of Service, please contact us
          at{" "}
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
