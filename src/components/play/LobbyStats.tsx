"use client";

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

const TIER_THRESHOLDS: Record<
  string,
  { min: number; max: number; next: string | null; nextThreshold: number | null }
> = {
  Bronze: { min: 0, max: 14999, next: "Silver", nextThreshold: 15000 },
  Silver: { min: 15000, max: 24999, next: "Gold", nextThreshold: 25000 },
  Gold: { min: 25000, max: 34999, next: "Elite", nextThreshold: 35000 },
  Elite: { min: 35000, max: Infinity, next: null, nextThreshold: null },
};

const TIER_COLORS: Record<string, string> = {
  Bronze: "#CD7F32",
  Silver: "#C0C0C0",
  Gold: "#FFD700",
  Elite: "#9333EA",
};

const TIER_EMOJIS: Record<string, string> = {
  Bronze: "🥉",
  Silver: "🥈",
  Gold: "🥇",
  Elite: "👑",
};

export default function LobbyStats({
  pesaPoints,
  pesaTokens,
  streak,
  friendsCount,
  tier = "Bronze",
  onPressTokens,
  onPressPoints,
  onPressLeaderboard,
}: {
  pesaPoints: number;
  pesaTokens: number;
  streak: number;
  friendsCount: number;
  tier?: string;
  onPressTokens?: () => void;
  onPressPoints?: () => void;
  onPressLeaderboard?: () => void;
}) {
  const tierInfo = TIER_THRESHOLDS[tier] || TIER_THRESHOLDS.Bronze;
  const tierColor = TIER_COLORS[tier] || TIER_COLORS.Bronze;
  const tierEmoji = TIER_EMOJIS[tier] || TIER_EMOJIS.Bronze;

  const rawProgress = tierInfo.nextThreshold
    ? ((pesaPoints - tierInfo.min) / (tierInfo.nextThreshold - tierInfo.min)) * 100
    : 100;
  const progress = clamp(rawProgress, 0, 100);

  return (
    <div className="mx-4 mt-2 overflow-hidden rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      <div
        className="border border-white/40"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,253,240,0.98), rgba(245,242,220,0.95))",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Top Row: Quick Stats */}
        <div className="flex divide-x divide-[rgba(45,80,22,0.08)] border-b border-[rgba(45,80,22,0.08)]">
          <button
            className="flex-1 py-3 px-1 text-center hover:bg-black/5 transition-colors"
            onClick={onPressPoints}
            type="button"
          >
            <div className="text-base sm:text-lg font-black text-[rgb(45,80,22)] tracking-tight">
              {Number.isFinite(pesaPoints) ? pesaPoints.toLocaleString() : "0"}
            </div>
            <div className="text-[9px] text-[rgba(93,78,55,0.7)] uppercase tracking-tighter font-bold">
              Points
            </div>
          </button>

          <button
            className="flex-1 py-3 px-1 text-center hover:bg-black/5 transition-colors"
            onClick={onPressTokens}
            type="button"
          >
            <div className="text-base sm:text-lg font-black text-[#8B5CF6] tracking-tight">
              💎 {Number.isFinite(pesaTokens) ? pesaTokens : 0}
            </div>
            <div className="text-[9px] text-[rgba(93,78,55,0.7)] uppercase tracking-tighter font-bold">
              Tokens
            </div>
          </button>

          <div className="flex-1 py-3 px-1 text-center">
            <div className="text-base sm:text-lg font-black text-[#F59E0B] tracking-tight">
              🔥 {Number.isFinite(streak) ? streak : 0}
            </div>
            <div className="text-[9px] text-[rgba(93,78,55,0.7)] uppercase tracking-tighter font-bold">
              Streak
            </div>
          </div>

          <div className="flex-1 py-3 px-1 text-center">
            <div className="text-base sm:text-lg font-black text-[#10B981] tracking-tight">
              {Number.isFinite(friendsCount) ? friendsCount : 0}
            </div>
            <div className="text-[9px] text-[rgba(93,78,55,0.7)] uppercase tracking-tighter font-bold">
              Friends
            </div>
          </div>
        </div>

        {/* Bottom Row: Tier Progress */}
        <button
          className="px-4 py-3 w-full text-left hover:bg-black/5 transition-colors"
          onClick={onPressLeaderboard}
          type="button"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div style={{ fontSize: 24 }}>{tierEmoji}</div>
              <div className="flex flex-col">
                <div className="text-sm font-black" style={{ color: tierColor }}>
                  {tier} Tier
                </div>
                <div className="text-[10px] font-bold text-[rgba(93,78,55,1)]">
                  {Number.isFinite(pesaPoints) ? pesaPoints.toLocaleString() : "0"} Total Pesa
                </div>
              </div>
            </div>

            {tierInfo.nextThreshold ? (
              <div className="text-[10px] text-right font-bold text-[rgba(93,78,55,0.7)] leading-tight">
                {(tierInfo.nextThreshold - pesaPoints).toLocaleString()} <br />to {tierInfo.next}
              </div>
            ) : null}
          </div>

          {tierInfo.nextThreshold ? (
            <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: tierColor }}
              />
            </div>
          ) : (
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: tierColor }}>
                🌟 Elite Master 🌟
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
