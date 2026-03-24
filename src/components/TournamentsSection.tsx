import { Calendar, Clock, Users, Trophy, Zap } from "lucide-react";

const tournaments = [
  {
    title: "Weekend Warrior Cup",
    date: "Every Saturday",
    time: "2:00 PM EAT",
    players: "16 Players",
    prize: "Top 3 Win Prizes",
    status: "recurring" as const,
    description:
      "Weekly knockout tournament. Battle through 4 rounds to claim the cup and bragging rights.",
  },
  {
    title: "PesaMali Grand Championship",
    date: "Coming Soon",
    time: "TBA",
    players: "64 Players",
    prize: "Grand Prize Pool",
    status: "upcoming" as const,
    description:
      "The ultimate test of financial skill. Multi-round tournament with the biggest prize pool yet.",
  },
  {
    title: "Beginners' Friendly",
    date: "Every Wednesday",
    time: "6:00 PM EAT",
    players: "8 Players",
    status: "recurring" as const,
    prize: "Learn & Win",
    description:
      "New to PesaMali? Join our beginner-friendly tournament to learn the ropes and win starter rewards.",
  },
];

function StatusBadge({ status }: { status: "recurring" | "upcoming" }) {
  if (status === "recurring") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
        <Zap size={10} />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
      <Clock size={10} />
      Coming Soon
    </span>
  );
}

export default function TournamentsSection() {
  return (
    <section id="tournaments" className="relative py-20 sm:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('/solid_color_branding.png')" }}
      />
      <div className="absolute inset-0 bg-brand-dark/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
            Compete
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-cream mt-3 mb-5">
            Upcoming Tournaments
          </h2>
          <p className="text-brand-cream/60 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Prove your financial mastery in competitive tournaments. Climb the
            leaderboard and win real rewards.
          </p>
        </div>

        {/* Tournament cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <div
              key={t.title}
              className="bg-brand-green/30 backdrop-blur-sm border border-brand-olive/30 rounded-2xl overflow-hidden hover:border-brand-gold/40 transition-all group"
            >
              {/* Card top accent */}
              <div className="h-1.5 bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold" />

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                    <Trophy size={22} className="text-brand-gold" />
                  </div>
                  <StatusBadge status={t.status} />
                </div>

                <h3 className="text-brand-cream font-bold text-lg mb-2">
                  {t.title}
                </h3>
                <p className="text-brand-cream/50 text-sm leading-relaxed mb-5">
                  {t.description}
                </p>

                {/* Details */}
                <div className="flex flex-wrap gap-3 text-xs text-brand-cream/60">
                  <span className="inline-flex items-center gap-1 bg-brand-dark/50 px-2.5 py-1 rounded-full">
                    <Calendar size={12} className="text-brand-gold" />
                    {t.date}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-brand-dark/50 px-2.5 py-1 rounded-full">
                    <Clock size={12} className="text-brand-gold" />
                    {t.time}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-brand-dark/50 px-2.5 py-1 rounded-full">
                    <Users size={12} className="text-brand-gold" />
                    {t.players}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-brand-cream/50 text-sm">
            Download the app to register for tournaments and get notified when
            new events launch.
          </p>
        </div>
      </div>
    </section>
  );
}
