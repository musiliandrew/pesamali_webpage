"use client";

import { useEffect, useMemo, useRef } from "react";

export type WebDream = {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  category?: string | null;
  cost?: number | null;
  icon?: string | null;
};

function getDreamLabel(d: WebDream): string {
  return d.name || d.title || "Dream";
}

function getDreamEmoji(dream: WebDream): string {
  const rawIcon = dream.icon?.trim();
  if (rawIcon && rawIcon !== "🌟" && rawIcon !== "⭐" && rawIcon !== "✨") return rawIcon;

  const n = getDreamLabel(dream).toLowerCase();
  if (n.includes("hospital") || n.includes("clinic") || n.includes("health") || n.includes("medical")) return "🏥";
  if (n.includes("school") || n.includes("university") || n.includes("college") || n.includes("education")) return "🎓";
  if (n.includes("house") || n.includes("home") || n.includes("villa") || n.includes("mansion") || n.includes("apartment")) return "🏡";
  if (n.includes("car") || n.includes("vehicle") || n.includes("automobile")) return "🚗";
  if (n.includes("yacht") || n.includes("boat") || n.includes("ship") || n.includes("ocean")) return "🛥️";
  if (n.includes("jet") || n.includes("plane") || n.includes("aircraft") || n.includes("flight") || n.includes("air")) return "✈️";
  if (n.includes("business") || n.includes("company") || n.includes("enterprise") || n.includes("startup")) return "🏢";
  if (n.includes("farm") || n.includes("agri") || n.includes("land") || n.includes("ranch")) return "🌾";
  if (n.includes("hotel") || n.includes("resort") || n.includes("lodge")) return "🏨";
  if (n.includes("restaurant") || n.includes("cafe") || n.includes("food") || n.includes("kitchen")) return "🍴";
  if (n.includes("shop") || n.includes("mall") || n.includes("store") || n.includes("retail")) return "🛍️";
  if (n.includes("ducati") || n.includes("motorbike") || n.includes("motorcycle") || n.includes("bike") || n.includes("moto")) return "🏍️";
  if (n.includes("voyage") || n.includes("globe") || n.includes("around the world") || n.includes("world tour")) return "🌍";
  if (n.includes("travel") || n.includes("backpack") || n.includes("adventure") || n.includes("explore") || n.includes("safari")) return "🌍";
  if (n.includes("invest") || n.includes("portfolio") || n.includes("stock") || n.includes("fund")) return "📈";
  if (n.includes("children") || n.includes("orphan") || n.includes("charity") || n.includes("foundation") || n.includes("hope")) return "❤️";
  if (n.includes("legacy") || n.includes("heritage") || n.includes("dynasty")) return "👑";
  if (n.includes("tech") || n.includes("software") || n.includes("app") || n.includes("digital")) return "💻";
  if (n.includes("solar") || n.includes("energy") || n.includes("power")) return "⚡";
  if (n.includes("pension") || n.includes("retire") || n.includes("savings")) return "🏦";
  if (n.includes("sport") || n.includes("gym") || n.includes("fitness")) return "🏆";

  const cat = (dream.category || "").toLowerCase();
  if (cat.includes("lifestyle")) return "🏡";
  if (cat.includes("wealth")) return "💰";
  if (cat.includes("legacy")) return "👑";
  if (cat.includes("adventure")) return "🌍";
  if (cat.includes("growth")) return "📈";

  return "💎";
}

function getDreamTheme(dream: WebDream, index: number): {
  colors: [string, string, string];
  categoryColor: string;
  categoryBg: string;
} {
  const cat = (dream.category || "").toLowerCase();
  const name = getDreamLabel(dream).toLowerCase();

  if (cat.includes("legacy") || name.includes("legacy") || name.includes("hospital") || name.includes("school"))
    return { colors: ["#7B1A1A", "#9B2525", "#6B1010"], categoryColor: "#FF8A8A", categoryBg: "rgba(255,100,100,0.25)" };

  if (cat.includes("adventure") || name.includes("adventure") || name.includes("travel") || name.includes("backpack"))
    return { colors: ["#5C3300", "#7C4A00", "#4A2800"], categoryColor: "#FFB74D", categoryBg: "rgba(255,183,77,0.25)" };

  if (cat.includes("wealth") || name.includes("business") || name.includes("invest") || name.includes("empire"))
    return { colors: ["#1A2E0A", "#2D5016", "#0F1C06"], categoryColor: "#81C784", categoryBg: "rgba(129,199,132,0.25)" };

  if (cat.includes("lifestyle") || name.includes("house") || name.includes("home") || name.includes("villa"))
    return { colors: ["#1A1A4E", "#2D2D7E", "#0F0F3A"], categoryColor: "#90CAF9", categoryBg: "rgba(144,202,249,0.25)" };

  if (cat.includes("growth") || name.includes("car") || name.includes("vehicle") || name.includes("yacht"))
    return { colors: ["#1A3A1A", "#2D6B2D", "#0F280F"], categoryColor: "#A5D6A7", categoryBg: "rgba(165,214,167,0.25)" };

  if (name.includes("tech") || name.includes("startup") || name.includes("app") || name.includes("platform"))
    return { colors: ["#0D1B2E", "#1A3A5C", "#091525"], categoryColor: "#80DEEA", categoryBg: "rgba(128,222,234,0.25)" };

  const fallbacks: Array<{ colors: [string, string, string]; categoryColor: string; categoryBg: string }> = [
    { colors: ["#7B1A1A", "#9B2525", "#5C1010"], categoryColor: "#FF8A8A", categoryBg: "rgba(255,100,100,0.25)" },
    { colors: ["#5C3300", "#7C4A00", "#402200"], categoryColor: "#FFB74D", categoryBg: "rgba(255,183,77,0.25)" },
    { colors: ["#1A2E0A", "#2D5016", "#0F1C06"], categoryColor: "#81C784", categoryBg: "rgba(129,199,132,0.25)" },
    { colors: ["#1A1A4E", "#2D2D7E", "#101050"], categoryColor: "#90CAF9", categoryBg: "rgba(144,202,249,0.25)" },
  ];

  return fallbacks[index % fallbacks.length];
}

function resolveCategory(dream: WebDream, index: number): string {
  if (dream.category && dream.category.trim()) return dream.category.toUpperCase();
  const fallbacks = ["LIFESTYLE", "WEALTH", "GROWTH", "LEGACY", "ADVENTURE"];
  return fallbacks[index % fallbacks.length];
}

export default function DreamCarousel({
  dreams,
  selectedDreamId,
  onSelectDream,
}: {
  dreams: WebDream[];
  selectedDreamId: string;
  onSelectDream: (dreamId: string) => void;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const idx = dreams.findIndex((d) => d.id === selectedDreamId);
    if (idx <= 0) return;

    // best-effort center scroll
    const child = el.children.item(idx) as HTMLElement | null;
    if (!child) return;
    const left = child.offsetLeft - el.clientWidth / 2 + child.clientWidth / 2;
    el.scrollTo({ left, behavior: "smooth" });
  }, [selectedDreamId, dreams]);

  const dots = useMemo(() => dreams.slice(0, 10), [dreams]);

  if (!dreams || dreams.length === 0) {
    return <div className="text-sm text-brand-dark/60 font-semibold">Loading dreams…</div>;
  }

  return (
    <div>
      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {dreams.map((dream, index) => {
          const theme = getDreamTheme(dream, index);
          const category = resolveCategory(dream, index);
          const emoji = getDreamEmoji(dream);
          const isSelected = dream.id === selectedDreamId;
          const cost = typeof dream.cost === "number" ? dream.cost : 0;

          return (
            <button
              key={dream.id}
              onClick={() => onSelectDream(dream.id)}
              className={
                "snap-start shrink-0 w-[220px] h-[182px] rounded-[20px] overflow-hidden border-[2.5px] transition-transform active:scale-[0.99] " +
                (isSelected ? "border-[#FFD700]" : "border-transparent")
              }
              style={{
                background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})`,
              }}
            >
              <div className="relative w-full h-full p-4 flex flex-col justify-between">
                <div className="absolute inset-0 bg-white/5" />
                {isSelected && <div className="absolute inset-0 bg-[rgba(255,215,0,0.07)]" />}

                <div className="relative flex items-start justify-between">
                  <div
                    className="text-[10px] font-black tracking-[1px] px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: theme.categoryBg, color: theme.categoryColor }}
                  >
                    {category}
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#FFD700] shadow-md shadow-[#FFD700]/50 flex items-center justify-center">
                      <div className="text-[13px] font-black text-[#1A1A1A]">✓</div>
                    </div>
                  )}
                </div>

                <div className="relative -mt-1">
                  <div className="text-[46px] leading-[54px]">{emoji}</div>
                </div>

                <div className="relative">
                  <div className="text-white text-[15px] leading-5 font-extrabold drop-shadow-sm line-clamp-2">
                    {getDreamLabel(dream)}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="text-[#FFD700] text-[13px] font-black">★</div>
                    <div className="text-white/90 text-[13px] font-extrabold">
                      {cost.toLocaleString()} pts
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 mt-3">
        {dots.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelectDream(d.id)}
            className={
              "h-[6px] rounded-full transition-all " +
              (d.id === selectedDreamId
                ? "w-[22px] bg-[rgb(45,80,22)]"
                : "w-[6px] bg-[rgba(45,80,22,0.25)]")
            }
            aria-label="Select dream"
          />
        ))}
      </div>
    </div>
  );
}
