import {
  Dice1,
  CreditCard,
  PiggyBank,
  ShoppingCart,
  Building,
  Trophy,
} from "lucide-react";

const steps = [
  {
    icon: Dice1,
    step: "01",
    title: "Roll the Dice",
    description:
      "Take turns rolling the dice to move around the board. Each space you land on triggers a different financial event.",
  },
  {
    icon: CreditCard,
    step: "02",
    title: "Draw Playing Cards",
    description:
      "Land on a yellow spot and draw a card — you might gain income or face an unexpected expense. Real-life scenarios keep you on your toes.",
  },
  {
    icon: PiggyBank,
    step: "03",
    title: "Use Savings Cards",
    description:
      "Protect your Pesa Points! Play savings cards to shield yourself from losses and earn bonus points when conditions are met.",
  },
  {
    icon: ShoppingCart,
    step: "04",
    title: "Handle Spending Cards",
    description:
      "Life throws bills at you — electricity, groceries, school fees. Pay your spending cards strategically to minimize losses.",
  },
  {
    icon: Building,
    step: "05",
    title: "Buy & Invest in Assets",
    description:
      "Purchase assets like land, businesses, or stocks. They cost upfront but can earn you returns as the game progresses.",
  },
  {
    icon: Trophy,
    step: "06",
    title: "Win the Game",
    description:
      "The first player to play all their savings cards, spending cards, buy their assets, and purchase the dream wins the match! Strategize wisely to finish first.",
  },
];

export default function HowToPlaySection() {
  return (
    <section id="how-to-play" className="relative py-20 sm:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('/solid_color_branding.png')" }}
      />
      <div className="absolute inset-0 bg-brand-dark/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
            Instructions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-cream mt-3 mb-5">
            How to Play
          </h2>
          <p className="text-brand-cream/60 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            PesaMali is easy to learn but hard to master. Here&apos;s how a game
            works from start to finish.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative bg-brand-green/30 backdrop-blur-sm border border-brand-olive/30 rounded-2xl p-6 hover:border-brand-gold/40 transition-all group"
            >
              {/* Step number */}
              <span className="absolute -top-3 -right-3 bg-brand-gold text-brand-dark text-xs font-extrabold w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                {item.step}
              </span>

              <div className="w-14 h-14 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-5 group-hover:bg-brand-gold/20 transition-colors">
                <item.icon size={28} className="text-brand-gold" />
              </div>

              <h3 className="text-brand-cream font-bold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-brand-cream/50 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Pro tips */}
        <div className="mt-14 bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto">
          <h3 className="text-brand-gold font-bold text-lg mb-4 text-center">
            Pro Tips
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-brand-cream/70">
            <li className="flex items-start gap-2">
              <span className="text-brand-gold mt-0.5">&#x2713;</span>
              Save your savings cards for big losses — don&apos;t waste them early
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold mt-0.5">&#x2713;</span>
              Buy assets early — they earn returns every round
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold mt-0.5">&#x2713;</span>
              Read spending card breakdowns — know where your money goes
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-gold mt-0.5">&#x2713;</span>
              Watch your opponent&apos;s moves — timing is everything
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
