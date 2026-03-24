import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — PesaMali",
  description: "PesaMali Terms of Service. Read the rules and conditions governing your use of PesaMali.",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-brand-cream/40 text-sm mb-10">
          Last updated: March 24, 2026
        </p>

        <div className="space-y-10 text-brand-cream/70 text-sm sm:text-base leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, accessing, or using the PesaMali mobile application
              or website (collectively, the &quot;Service&quot;), you agree to be bound by these Terms
              of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service.
              PesaMali reserves the right to modify these Terms at any time. Continued use of
              the Service after changes are posted constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">2. Description of Service</h2>
            <p>
              PesaMali (&quot;The Game of Money&quot;) is a digital board game designed to teach financial
              literacy through interactive gameplay. Players compete in matches involving dice
              rolls, card draws, saving, spending, and investing mechanics. The Service includes
              but is not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-3">
              <li>Multiplayer real-time board game matches</li>
              <li>Friend challenges and social features</li>
              <li>Tournaments and competitive events</li>
              <li>In-game currency (Pesa Points and Tokens)</li>
              <li>AI-powered financial advice and game analysis</li>
              <li>Leaderboards and player statistics</li>
              <li>Educational financial literacy content</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">3. Account Registration</h2>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">3.1 Eligibility</h3>
            <p>
              You must be at least 13 years of age to create an account. If you are under 18,
              you must have parental or guardian consent to use the Service. By creating an
              account, you represent that you meet these requirements.
            </p>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">3.2 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials.
              You agree to notify us immediately of any unauthorized access to or use of your
              account. PesaMali is not liable for any loss arising from unauthorized use of
              your account.
            </p>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">3.3 Account Accuracy</h3>
            <p>
              You agree to provide accurate, current, and complete information during registration
              and to update such information as necessary. We reserve the right to suspend or
              terminate accounts that contain false or misleading information.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">4. Game Rules &amp; Fair Play</h2>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">4.1 Gameplay</h3>
            <p>
              PesaMali matches are governed by the in-game rules. Each match involves rolling
              dice, drawing cards (playing cards, savings cards, spending cards), buying assets,
              and managing your Pesa Points balance. The player with the most Pesa Points at the
              end of a match wins.
            </p>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">4.2 Fair Play Policy</h3>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use cheats, exploits, hacks, bots, or unauthorized third-party software</li>
              <li>Manipulate game outcomes through any technical means</li>
              <li>Collude with other players to gain an unfair advantage</li>
              <li>Intentionally disconnect or abandon matches to avoid losses</li>
              <li>Exploit bugs or glitches (please report them to us instead)</li>
              <li>Create multiple accounts to circumvent bans or manipulate rankings</li>
            </ul>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">4.3 Penalties</h3>
            <p>
              Violations of the Fair Play Policy may result in warnings, temporary suspensions,
              permanent bans, forfeiture of in-game currency, or removal from tournaments and
              leaderboards, at our sole discretion.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">5. In-Game Currency &amp; Purchases</h2>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">5.1 Pesa Points</h3>
            <p>
              Pesa Points are the primary in-game currency earned through gameplay. They represent
              your performance within matches and have no real-world monetary value. Pesa Points
              cannot be exchanged for real currency, goods, or services outside the Service.
            </p>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">5.2 Tokens</h3>
            <p>
              Tokens are a premium in-game currency that may be purchased with real money or
              earned through gameplay. Tokens can be used for in-app features such as entering
              premium tournaments or unlocking content. All Token purchases are final and
              non-refundable unless required by applicable law.
            </p>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">5.3 Refund Policy</h3>
            <p>
              Refunds for in-app purchases are governed by the policies of the platform through
              which the purchase was made (Google Play Store or Apple App Store). We do not
              directly process refunds for purchases made through these platforms.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">6. User Conduct</h2>
            <p className="mb-3">When using the Service, you agree not to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Harass, threaten, bully, or intimidate other users</li>
              <li>Use offensive, discriminatory, or hateful language</li>
              <li>Impersonate other users, PesaMali staff, or any third party</li>
              <li>Share or distribute inappropriate, illegal, or harmful content</li>
              <li>Attempt to access other users&apos; accounts without authorization</li>
              <li>Use the Service for any unlawful purpose</li>
              <li>Interfere with or disrupt the Service or its servers/networks</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">7. Tournaments &amp; Competitions</h2>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">7.1 Participation</h3>
            <p>
              Tournaments are subject to specific rules, schedules, and eligibility requirements
              that will be communicated before each event. By entering a tournament, you agree
              to abide by its specific rules in addition to these Terms.
            </p>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">7.2 Prizes</h3>
            <p>
              Tournament prizes (if any) will be specified before the event. PesaMali reserves
              the right to modify prize structures, cancel, or postpone tournaments at any time
              with reasonable notice. Prizes may be subject to eligibility verification.
            </p>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">7.3 Disqualification</h3>
            <p>
              Players found violating the Fair Play Policy or tournament-specific rules may be
              disqualified, and any prizes revoked.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">8. Intellectual Property</h2>
            <p>
              All content within the Service — including but not limited to the game design,
              graphics, characters, card designs, logos, text, audio, code, and trademarks —
              is the exclusive property of PesaMali and its licensors. You may not copy,
              reproduce, modify, distribute, or create derivative works based on any part of
              the Service without prior written consent. Your use of the Service grants you a
              limited, non-exclusive, non-transferable, revocable license to access and use it
              for personal, non-commercial purposes.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">9. Disclaimers</h2>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">9.1 &quot;As Is&quot; Service</h3>
            <p>
              The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties
              of any kind, either express or implied, including but not limited to implied
              warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">9.2 Educational Purpose</h3>
            <p>
              PesaMali is designed for entertainment and educational purposes. The financial
              scenarios, tips, and AI-generated advice within the game are for illustrative and
              educational purposes only and do not constitute professional financial advice. You
              should consult qualified financial advisors for real-world financial decisions.
            </p>

            <h3 className="text-base font-semibold text-brand-gold/80 mt-4 mb-2">9.3 Availability</h3>
            <p>
              We do not guarantee that the Service will be uninterrupted, error-free, or free
              of harmful components. We reserve the right to modify, suspend, or discontinue
              any aspect of the Service at any time without prior notice.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, PesaMali and its directors,
              officers, employees, affiliates, and agents shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including but not limited
              to loss of profits, data, goodwill, or other intangible losses, arising out of or
              related to your use of or inability to use the Service. Our total liability for any
              claim arising from or related to the Service shall not exceed the amount you paid
              to us (if any) in the twelve (12) months preceding the claim.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless PesaMali and its affiliates,
              officers, directors, employees, and agents from and against any claims, liabilities,
              damages, losses, costs, or expenses (including reasonable legal fees) arising out of
              or related to your use of the Service, violation of these Terms, or infringement of
              any third-party rights.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">12. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time, with or without
              cause, with or without notice. You may delete your account at any time through the
              app settings or by contacting us. Upon termination, your right to use the Service
              ceases immediately. Provisions that by their nature should survive termination
              (including intellectual property, disclaimers, limitation of liability, and
              indemnification) shall survive.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">13. Governing Law &amp; Disputes</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the
              Republic of Kenya. Any disputes arising out of or relating to these Terms or the
              Service shall first be attempted to be resolved through good-faith negotiation.
              If negotiation fails, disputes shall be submitted to the exclusive jurisdiction of
              the courts of Nairobi, Kenya.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">14. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, that
              provision shall be enforced to the maximum extent permissible, and the remaining
              provisions shall remain in full force and effect.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">15. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement
              between you and PesaMali regarding the use of the Service, superseding any prior
              agreements or understandings.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-xl font-bold text-brand-cream mb-3">16. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-3 bg-brand-green/30 border border-brand-olive/30 rounded-xl p-4">
              <p><strong className="text-brand-cream">PesaMali</strong></p>
              <p>Nairobi, Kenya</p>
              <p>
                Email:{" "}
                <a href="mailto:hello@pesamali.com" className="text-brand-gold hover:underline">
                  hello@pesamali.com
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
