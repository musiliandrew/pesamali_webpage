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
    <div className="mx-4 mt-3 overflow-hidden rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      <div
        className="border border-white/40"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,253,240,0.98), rgba(245,242,220,0.95))",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex">
          <div className="flex">
            <div className="flex">
              <button
                className="flex-1 py-3 text-center"
                onClick={onPressPoints}
                type="button"
              >
                <div className="text-lg font-extrabold text-[rgb(45,80,22)] tracking-tight">
                  {Number.isFinite(pesaPoints) ? pesaPoints.toLocaleString() : "0"}
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <div className="text-[10px] text-[rgba(93,78,55,1)] uppercase tracking-wider font-semibold">
                    Pesa Points
                  </div>
                  <div className="bg-[rgba(45,80,22,0.10)] rounded-full w-4 h-4 flex items-center justify-center">
                    <div className="text-[rgb(45,80,22)] font-bold text-[10px]">i</div>
                  </div>
                </div>
              </button>

              <div className="w-px bg-[rgba(45,80,22,0.10)] my-3" />

              <button
                className="flex-1 py-3 text-center"
                onClick={onPressTokens}
                type="button"
              >
                <div className="flex items-center justify-center gap-1">
                  <div className="text-lg font-extrabold text-[#8B5CF6] tracking-tight">
                    💎 {Number.isFinite(pesaTokens) ? pesaTokens : 0}
                  </div>
                  <div className="bg-[rgba(45,80,22,0.10)] rounded-full w-5 h-5 flex items-center justify-center">
                    <div className="text-[rgb(45,80,22)] font-bold text-xs">+</div>
                  </div>
                </div>
                <div className="mt-1 text-[10px] text-[rgba(93,78,55,1)] uppercase tracking-wider font-semibold">
                  Pesa Tokens
                </div>
              </button>
            </div>

            <div className="h-px bg-[rgba(45,80,22,0.10)] mx-6" />

            <div className="flex">
              <div className="flex-1 py-3 text-center">
                <div className="text-lg font-extrabold text-[#F59E0B] tracking-tight">
                  🔥 {Number.isFinite(streak) ? streak : 0}
                </div>
                <div className="mt-0.5 text-[10px] text-[rgba(93,78,55,1)] uppercase tracking-wider font-semibold">
                  Day Streak
                </div>
              </div>

              <div className="w-px bg-[rgba(45,80,22,0.10)] my-2" />

              <div className="flex-1 py-3 text-center">
                <div className="text-lg font-extrabold text-[#10B981] tracking-tight">
                  {Number.isFinite(friendsCount) ? friendsCount : 0}
                </div>
                <div className="mt-1 text-[10px] text-[rgba(93,78,55,1)] uppercase tracking-wider font-semibold">
                  Friends Online
                </div>
              </div>
            </div>

            <div className="h-px bg-[rgba(45,80,22,0.10)] mx-6" />

            <button className="px-4 py-3 w-full" onClick={onPressLeaderboard} type="button">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div style={{ fontSize: 20 }}>{tierEmoji}</div>
                  <div className="text-left">
                    <div className="text-sm font-bold" style={{ color: tierColor }}>
                      {tier} Tier
                    </div>
                    <div className="text-xs text-[rgba(93,78,55,1)]">
                      {Number.isFinite(pesaPoints) ? pesaPoints.toLocaleString() : "0"} Total Points
                    </div>
                  </div>
                </div>

                {tierInfo.nextThreshold ? (
                  <div className="text-xs text-[rgba(93,78,55,1)]">
                    {(tierInfo.nextThreshold - pesaPoints).toLocaleString()} to {tierInfo.next}
                  </div>
                ) : null}
              </div>

              {tierInfo.nextThreshold ? (
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${progress}%`, backgroundColor: tierColor }}
                  />
                </div>
              ) : null}

              {tier === "Elite" ? (
                <div className="text-center mt-2">
                  <div className="text-xs font-semibold" style={{ color: tierColor }}>
                    🌟 Maximum Tier Achieved! 🌟
                  </div>
                </div>
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
