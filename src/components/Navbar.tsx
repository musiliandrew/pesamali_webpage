"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Download } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "How to Play", href: "#how-to-play" },
  { label: "Tournaments", href: "#tournaments" },
  { label: "Community", href: "#community" },
  { label: "Download", href: "#download" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-brand-olive/30 bg-cover bg-center"
      style={{ backgroundImage: "url('/solid_color_branding.png')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/pesmalai-logo.png"
              alt="PesaMali Logo"
              width={280}
              height={84}
              className="h-16 sm:h-20 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-cream/80 hover:text-brand-gold transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://chat.whatsapp.com/K0LVCrduHPiJYShQJXbAdM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="15" height="15" fill="currentColor">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.735 5.476 2.02 7.782L0 32l8.39-2.002A15.946 15.946 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.267 13.267 0 01-6.788-1.858l-.486-.29-5.018 1.197 1.24-4.875-.317-.5A13.307 13.307 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.28-9.907c-.4-.2-2.363-1.163-2.73-1.295-.366-.13-.633-.197-.9.2-.267.397-1.03 1.296-1.263 1.563-.233.267-.466.3-.866.1-.4-.2-1.69-.622-3.218-1.982-1.19-1.06-1.993-2.37-2.226-2.77-.234-.4-.025-.617.175-.816.18-.18.4-.467.6-.7.2-.233.267-.4.4-.666.133-.266.067-.5-.034-.7-.1-.2-.9-2.163-1.233-2.963-.325-.78-.657-.673-.9-.685l-.767-.013c-.266 0-.7.1-1.066.5-.367.4-1.4 1.368-1.4 3.33 0 1.963 1.433 3.863 1.633 4.13.2.267 2.82 4.3 6.832 6.03.955.412 1.7.658 2.28.842.958.305 1.832.262 2.52.16.768-.115 2.363-.966 2.696-1.9.333-.933.333-1.733.234-1.9-.1-.167-.366-.267-.766-.466z" />
              </svg>
              Join WhatsApp
            </a>
            <Link
              href="#download"
              className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:scale-105"
            >
              <Download size={16} />
              Get the App
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-brand-cream p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="relative z-10 md:hidden bg-brand-dark/95 backdrop-blur-md border-t border-brand-olive/30">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-brand-cream/80 hover:text-brand-gold transition-colors text-base font-medium py-2 border-b border-brand-olive/20"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://chat.whatsapp.com/K0LVCrduHPiJYShQJXbAdM"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm px-5 py-3 rounded-full mt-1 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="15" height="15" fill="currentColor">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.735 5.476 2.02 7.782L0 32l8.39-2.002A15.946 15.946 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.267 13.267 0 01-6.788-1.858l-.486-.29-5.018 1.197 1.24-4.875-.317-.5A13.307 13.307 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.28-9.907c-.4-.2-2.363-1.163-2.73-1.295-.366-.13-.633-.197-.9.2-.267.397-1.03 1.296-1.263 1.563-.233.267-.466.3-.866.1-.4-.2-1.69-.622-3.218-1.982-1.19-1.06-1.993-2.37-2.226-2.77-.234-.4-.025-.617.175-.816.18-.18.4-.467.6-.7.2-.233.267-.4.4-.666.133-.266.067-.5-.034-.7-.1-.2-.9-2.163-1.233-2.963-.325-.78-.657-.673-.9-.685l-.767-.013c-.266 0-.7.1-1.066.5-.367.4-1.4 1.368-1.4 3.33 0 1.963 1.433 3.863 1.633 4.13.2.267 2.82 4.3 6.832 6.03.955.412 1.7.658 2.28.842.958.305 1.832.262 2.52.16.768-.115 2.363-.966 2.696-1.9.333-.933.333-1.733.234-1.9-.1-.167-.366-.267-.766-.466z" />
              </svg>
              Join WhatsApp
            </a>
            <Link
              href="#download"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-sm px-5 py-3 rounded-full mt-2 transition-all"
            >
              <Download size={16} />
              Get the App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
