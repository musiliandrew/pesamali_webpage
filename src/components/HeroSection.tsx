import Link from "next/link";
import { Download, ChevronDown } from "lucide-react";

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
            <a
              href="https://chat.whatsapp.com/K0LVCrduHPiJYShQJXbAdM"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-[#25D366]/25"
            >
              {/* WhatsApp icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="22" height="22" fill="currentColor">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.735 5.476 2.02 7.782L0 32l8.39-2.002A15.946 15.946 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.267 13.267 0 01-6.788-1.858l-.486-.29-5.018 1.197 1.24-4.875-.317-.5A13.307 13.307 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.28-9.907c-.4-.2-2.363-1.163-2.73-1.295-.366-.13-.633-.197-.9.2-.267.397-1.03 1.296-1.263 1.563-.233.267-.466.3-.866.1-.4-.2-1.69-.622-3.218-1.982-1.19-1.06-1.993-2.37-2.226-2.77-.234-.4-.025-.617.175-.816.18-.18.4-.467.6-.7.2-.233.267-.4.4-.666.133-.266.067-.5-.034-.7-.1-.2-.9-2.163-1.233-2.963-.325-.78-.657-.673-.9-.685l-.767-.013c-.266 0-.7.1-1.066.5-.367.4-1.4 1.368-1.4 3.33 0 1.963 1.433 3.863 1.633 4.13.2.267 2.82 4.3 6.832 6.03.955.412 1.7.658 2.28.842.958.305 1.832.262 2.52.16.768-.115 2.363-.966 2.696-1.9.333-.933.333-1.733.234-1.9-.1-.167-.366-.267-.766-.466z" />
              </svg>
              Join Community
            </a>
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
