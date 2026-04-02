import { Download, Smartphone, Apple, FileDown } from "lucide-react";

export default function DownloadSection() {
  return (
    <section id="download" className="relative py-20 sm:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('/solid_color_branding.png')" }}
      />
      <div className="absolute inset-0 bg-brand-dark/50" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section header */}
        <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
          Get Started
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-cream mt-3 mb-5">
          Download PesaMali
        </h2>
        <p className="text-brand-cream/60 max-w-xl mx-auto text-base sm:text-lg leading-relaxed mb-12">
          Available on Android and iOS. You can also download the APK directly
          if you prefer.
        </p>

        {/* Download buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-14">
          {/* Google Play */}
          <a
            href="#"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-green/60 hover:bg-brand-green border border-brand-olive/50 hover:border-brand-gold/50 text-brand-cream font-semibold px-8 py-4 rounded-2xl transition-all group"
          >
            <Smartphone
              size={28}
              className="text-brand-gold group-hover:scale-110 transition-transform"
            />
            <div className="text-left">
              <span className="block text-xs text-brand-cream/50 uppercase tracking-wide">
                Get it on
              </span>
              <span className="block text-lg font-bold leading-tight">
                Google Play
              </span>
            </div>
          </a>

          {/* App Store */}
          <a
            href="#"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-green/60 hover:bg-brand-green border border-brand-olive/50 hover:border-brand-gold/50 text-brand-cream font-semibold px-8 py-4 rounded-2xl transition-all group"
          >
            <Apple
              size={28}
              className="text-brand-gold group-hover:scale-110 transition-transform"
            />
            <div className="text-left">
              <span className="block text-xs text-brand-cream/50 uppercase tracking-wide">
                Download on the
              </span>
              <span className="block text-lg font-bold leading-tight">
                App Store
              </span>
            </div>
          </a>
        </div>

        {/* APK direct download */}
        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-6 sm:p-8 max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileDown size={24} className="text-brand-gold" />
            <h3 className="text-brand-cream font-bold text-lg">
              Direct APK Download
            </h3>
          </div>
          <p className="text-brand-cream/50 text-sm mb-5">
            Prefer to sideload? Download the APK file directly and install it on
            your Android device.
          </p>
          <a
            href="https://expo.dev/artifacts/eas/agszo1Jb4Rg37frhHkZtmr.apk"
            className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-brand-gold/20"
            download
          >
            <Download size={18} />
            Download APK
          </a>
          <p className="text-brand-cream/30 text-xs mt-3">
            You may need to enable &quot;Install from unknown sources&quot; in your
            device settings.
          </p>
        </div>
      </div>
    </section>
  );
}
