import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — PesaMali",
  description: "PesaMali Privacy Policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-60 -z-10"
        style={{ backgroundImage: "url('/solid_color_branding.png')" }}
      />
      <div className="fixed inset-0 bg-brand-dark/50 -z-10" />

      {/* Header */}
      <header className="border-b border-brand-olive/30 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/">
            <Image
              src="/pesmalai-logo.png"
              alt="PesaMali Logo"
              width={200}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-gold mb-2">
          Privacy Policy
        </h1>
        <p className="text-brand-cream/40 text-sm mb-10">
          Last updated: March 24, 2026
        </p>

        <div className="space-y-10 text-brand-cream/70 text-sm sm:text-base leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">1. Introduction</h2>
            <p>
              PesaMali (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the PesaMali mobile application
              and website (collectively, the &quot;Service&quot;). This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our Service.
              By accessing or using PesaMali, you agree to the terms of this Privacy Policy.
              If you do not agree, please do not use our Service.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">2. Information We Collect</h2>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">2.1 Personal Information</h3>
            <p className="mb-3">When you create an account or use our Service, we may collect:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your display name or username</li>
              <li>Email address</li>
              <li>Phone number (if provided for account verification)</li>
              <li>Profile picture (if uploaded)</li>
              <li>Authentication credentials (securely hashed passwords or third-party OAuth tokens)</li>
            </ul>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">2.2 Game Data</h3>
            <p className="mb-3">We automatically collect data related to your gameplay, including:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Match history, scores, and outcomes</li>
              <li>In-game actions (dice rolls, card plays, asset purchases)</li>
              <li>Pesa Points balance and transaction history</li>
              <li>Tournament participation and rankings</li>
              <li>Friends list and social interactions within the app</li>
            </ul>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">2.3 Device &amp; Technical Information</h3>
            <p className="mb-3">We may collect technical data such as:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Device type, model, and operating system version</li>
              <li>Unique device identifiers</li>
              <li>IP address and approximate location (country/region level)</li>
              <li>App version and crash/error logs</li>
              <li>Usage patterns (session duration, feature engagement)</li>
            </ul>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">2.4 Payment Information</h3>
            <p>
              If you make in-app purchases or token transactions, payment processing is handled
              by third-party providers (e.g., Paystack, Google Play, Apple App Store). We do not
              store your full credit/debit card details. We may receive transaction confirmations,
              amounts, and reference IDs from these providers.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Create and manage your account</li>
              <li>Provide, operate, and maintain the Service</li>
              <li>Match you with other players for games and tournaments</li>
              <li>Track game progress, scores, and leaderboard standings</li>
              <li>Process in-app purchases and token transactions</li>
              <li>Send you notifications about matches, friend requests, and tournaments</li>
              <li>Provide AI-powered game analysis and financial literacy tips</li>
              <li>Detect and prevent fraud, cheating, or abuse</li>
              <li>Improve the Service through analytics and bug tracking</li>
              <li>Respond to your support inquiries</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">4. Information Sharing &amp; Disclosure</h2>
            <p className="mb-3">
              We do not sell your personal information. We may share your data in the following
              limited circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-brand-cream">With Other Players:</strong> Your display name,
                profile picture, game stats, and leaderboard rankings are visible to other users.
              </li>
              <li>
                <strong className="text-brand-cream">Service Providers:</strong> We share data with
                trusted third parties who help us operate the Service (e.g., hosting, analytics,
                payment processing, push notifications).
              </li>
              <li>
                <strong className="text-brand-cream">Legal Requirements:</strong> We may disclose
                information if required by law, regulation, legal process, or governmental request.
              </li>
              <li>
                <strong className="text-brand-cream">Business Transfers:</strong> In the event of a
                merger, acquisition, or sale of assets, your information may be transferred as part
                of that transaction.
              </li>
              <li>
                <strong className="text-brand-cream">With Your Consent:</strong> We may share
                information for any other purpose with your explicit consent.
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information,
              including encrypted data transmission (TLS/SSL), secure password hashing,
              access controls, and regular security audits. However, no method of electronic
              transmission or storage is 100% secure. While we strive to protect your data,
              we cannot guarantee absolute security.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as
              needed to provide the Service. Game data (match history, stats) is retained
              indefinitely to maintain leaderboards and historical records. If you request
              account deletion, we will remove your personal information within 30 days,
              though anonymized gameplay data may be retained for analytics purposes.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">7. Your Rights &amp; Choices</h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of marketing communications and push notifications</li>
              <li>Withdraw consent for data processing (where applicable)</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:hello@moski.money" className="text-brand-gold hover:underline">
                hello@moski.money
              </a>.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">8. Children&apos;s Privacy</h2>
            <p>
              PesaMali is designed as an educational financial literacy game suitable for users
              of all ages. However, we do not knowingly collect personal information from children
              under 13 without parental consent. If you believe a child under 13 has provided
              us with personal information, please contact us and we will promptly delete it.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">9. Third-Party Services</h2>
            <p>
              Our Service may contain links to or integrations with third-party services
              (e.g., Google Play Store, Apple App Store, Paystack, Expo). These services have
              their own privacy policies, and we are not responsible for their practices. We
              encourage you to review their policies before providing any information.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">10. Cookies &amp; Tracking</h2>
            <p>
              Our website may use cookies and similar tracking technologies to enhance your
              experience, analyze usage patterns, and remember your preferences. You can
              control cookie settings through your browser. The mobile application does not
              use browser cookies but may use device-level identifiers for analytics.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">11. International Data Transfers</h2>
            <p>
              PesaMali is operated from Kenya. If you access the Service from outside Kenya,
              your information may be transferred to and processed in Kenya or other countries
              where our servers and service providers are located. By using the Service, you
              consent to the transfer of your information to these jurisdictions, which may
              have different data protection laws than your country of residence.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of
              significant changes by posting a notice within the app or sending a notification.
              Your continued use of the Service after changes are posted constitutes your
              acceptance of the updated policy. We encourage you to review this page periodically.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">13. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our
              data practices, please contact us:
            </p>
            <div className="mt-3 bg-brand-green/30 border border-brand-olive/30 rounded-xl p-4">
              <p><strong className="text-brand-cream">PesaMali</strong></p>
              <p>Nairobi, Kenya</p>
              <p>
                Email:{" "}
                <a href="mailto:hello@moski.money" className="text-brand-gold hover:underline">
                  hello@moski.money
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-brand-olive/20">
          <Link href="/" className="text-brand-gold hover:text-brand-gold-light text-sm transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
