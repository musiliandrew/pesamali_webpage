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

                <a
                  href="https://chat.whatsapp.com/K0LVCrduHPiJYShQJXbAdM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#25D366] hover:text-[#1ebe5d] font-semibold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="14" height="14" fill="currentColor">
                    <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.735 5.476 2.02 7.782L0 32l8.39-2.002A15.946 15.946 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.267 13.267 0 01-6.788-1.858l-.486-.29-5.018 1.197 1.24-4.875-.317-.5A13.307 13.307 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.28-9.907c-.4-.2-2.363-1.163-2.73-1.295-.366-.13-.633-.197-.9.2-.267.397-1.03 1.296-1.263 1.563-.233.267-.466.3-.866.1-.4-.2-1.69-.622-3.218-1.982-1.19-1.06-1.993-2.37-2.226-2.77-.234-.4-.025-.617.175-.816.18-.18.4-.467.6-.7.2-.233.267-.4.4-.666.133-.266.067-.5-.034-.7-.1-.2-.9-2.163-1.233-2.963-.325-.78-.657-.673-.9-.685l-.767-.013c-.266 0-.7.1-1.066.5-.367.4-1.4 1.368-1.4 3.33 0 1.963 1.433 3.863 1.633 4.13.2.267 2.82 4.3 6.832 6.03.955.412 1.7.658 2.28.842.958.305 1.832.262 2.52.16.768-.115 2.363-.966 2.696-1.9.333-.933.333-1.733.234-1.9-.1-.167-.366-.267-.766-.466z" />
                  </svg>
                  Join WhatsApp
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
