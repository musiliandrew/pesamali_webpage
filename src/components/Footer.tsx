import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "How to Play", href: "#how-to-play" },
  { label: "Tournaments", href: "#tournaments" },
  { label: "Download", href: "#download" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-brand-olive/30 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('/solid_color_branding.png')" }}
      />
      <div className="absolute inset-0 bg-brand-dark/50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Image
              src="/pesmalai-logo.png"
              alt="PesaMali Logo"
              width={200}
              height={60}
              className="h-14 w-auto object-contain"
            />
            <p className="text-brand-cream/60 text-sm mt-3 max-w-xs">
              The Game of Money — master your finances through play. A fun,
              competitive board game teaching financial literacy through
              real-life scenarios.
            </p>
          </div>

          {/* Links & Connect — side by side to save space */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {/* Quick Links split into two columns */}
            <div>
              <h4 className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-3">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-1.5">
                {footerLinks.slice(0, 2).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-brand-cream/60 hover:text-brand-gold transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-3 invisible">
                &nbsp;
              </h4>
              <ul className="flex flex-col gap-1.5">
                {footerLinks.slice(2).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-brand-cream/60 hover:text-brand-gold transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Connect */}
            <div>
              <h4 className="text-brand-gold font-semibold text-sm uppercase tracking-wider mb-3">
                Connect
              </h4>
              <div className="flex flex-col gap-1.5 text-sm text-brand-cream/60">
                <a
                  href="mailto:hello@moski.money"
                  className="hover:text-brand-gold transition-colors"
                >
                  hello@moski.money
                </a>

                <a
                  href="tel:+254751390976"
                  className="hover:text-brand-gold transition-colors"
                >
                  0751 390 976
                </a>

                <p>Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-brand-olive/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-brand-cream/40 text-xs">
            &copy; {new Date().getFullYear()} PesaMali. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-brand-cream/40 hover:text-brand-gold text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-brand-cream/40 hover:text-brand-gold text-xs transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-brand-cream/40 text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-brand-red fill-brand-red" /> in Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
