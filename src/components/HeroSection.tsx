import Link from "next/link";
import { Download, ChevronDown, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/theone_to_be_used_in_hero.png')" }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/30 to-brand-dark" />

      {/* Content — left-aligned so it doesn't overlap the characters */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 text-left pt-28 pb-16">
        <div className="max-w-3xl">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-brand-gold/40 bg-brand-gold/10">
            <span className="text-brand-gold text-sm font-medium tracking-wide">
              Coming Soon on Play Store &amp; App Store
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="text-brand-gold">Master Your Money</span>
            <br />
            <span className="text-brand-cream">Through Play</span>
          </h1>

          <p className="text-brand-cream/70 text-base sm:text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
            PesaMali is a fun, competitive board game that teaches you real
            financial skills — saving, spending, investing — through exciting
            real-life scenarios. Challenge friends. Build wealth. Learn the game
            of money.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-start gap-4 sm:gap-6">
            <Link
              href="/play"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-green/70 hover:bg-brand-green border border-brand-olive/50 hover:border-brand-gold/50 text-brand-cream font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-brand-dark/30"
            >
              <Play size={20} />
              Play Now
            </Link>
            <Link
              href="#download"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-brand-gold/20"
            >
              <Download size={20} />
              Download Now
            </Link>
            <Link
              href="#how-to-play"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-brand-cream/30 hover:border-brand-gold text-brand-cream hover:text-brand-gold font-semibold px-8 py-4 rounded-full text-lg transition-all"
            >
              Learn How to Play
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <Link href="#about" aria-label="Scroll down">
          <ChevronDown size={32} className="text-brand-gold/60" />
        </Link>
      </div>
    </section>
  );
}
