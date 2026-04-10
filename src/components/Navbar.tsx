"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Download, Play } from "lucide-react";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "How to Play", href: "/#how-to-play" },
  { label: "Tournaments", href: "/#tournaments" },
  { label: "Community", href: "/#community" },
  { label: "Shop", href: "/shop" },
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
            <Link
              href="/#download"
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
            <Link
              href="/#download"
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
