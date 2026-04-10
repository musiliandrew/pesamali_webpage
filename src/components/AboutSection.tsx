import { Target, Users, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Target,
    title: "Real-Life Scenarios",
    description:
      "Face financial decisions you encounter every day — from paying bills and saving for emergencies to investing in assets and handling unexpected expenses.",
  },
  {
    icon: Users,
    title: "Multiplayer Battles",
    description:
      "Challenge your friends to head-to-head matches. Compete to see who can build the most wealth and make the smartest financial moves.",
  },
  {
    icon: TrendingUp,
    title: "Build Wealth",
    description:
      "Learn the power of saving, investing, and smart spending. Every card, every roll, every decision teaches you something about money.",
  },
  {
    icon: Shield,
    title: "Savings & Protection",
    description:
      "Use savings cards to protect your Pesa Points, play spending cards strategically, and buy assets that earn returns over time.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('/solid_color_branding.png')" }}
      />
      <div className="absolute inset-0 bg-brand-dark/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
            About the Game
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-cream mt-3 mb-5">
            What is PesaMali?
          </h2>
          <p className="text-brand-cream/60 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            PesaMali is a digital board game inspired by the financial realities
            of everyday life in Africa. Roll the dice, draw cards, and make
            decisions that shape your financial future — all while having a
            blast with friends.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-brand-green/40 backdrop-blur-sm border border-brand-olive/30 rounded-2xl p-6 hover:border-brand-gold/40 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4 group-hover:bg-brand-gold/20 transition-colors">
                <feature.icon size={24} className="text-brand-gold" />
              </div>
              <h3 className="text-brand-cream font-bold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-brand-cream/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Physical Board Game CTA */}
        <div className="mt-16 bg-brand-gold/5 border border-brand-gold/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-brand-gold mb-2 group-hover:text-brand-gold-light transition-colors">Prefer the Classics?</h3>
            <p className="text-brand-cream/70 text-base">Get the high-quality physical board game for your school, club, or family. Same fun, same lessons, no screen required.</p>
          </div>
          <div className="shrink-0">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black px-8 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(212,168,67,0.2)]"
            >
              Order Physical Board Game
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
