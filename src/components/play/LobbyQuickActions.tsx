"use client";

import { Play, Users, Trophy, Hash, BookOpen, Gift, type LucideIcon } from "lucide-react";

function GridTile({
  icon: Icon,
  color,
  label,
  sub,
  onPress,
  badgeCount = 0,
}: {
  icon: LucideIcon;
  color: string;
  label: string;
  sub?: string;
  onPress: () => void;
  badgeCount?: number;
}) {
  return (
    <button
      onClick={onPress}
      className="flex-1 rounded-[20px] min-h-[92px] bg-[rgba(255,253,240,0.97)] border-[1.5px] border-[rgba(212,175,55,0.30)] shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
    >
      <div className="relative h-full flex flex-col items-center justify-center px-3 py-3">
        <div
          className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-2"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={22} color={color} strokeWidth={2} />
        </div>
        <div className="text-[11px] font-black text-[rgb(26,26,26)] text-center truncate w-full uppercase tracking-tighter">
          {label}
        </div>
        {sub ? (
          <div className="text-[9px] font-bold text-[rgba(139,115,85,0.7)] mt-0.5 text-center truncate w-full uppercase">
            {sub}
          </div>
        ) : null}
        {badgeCount > 0 ? (
          <div className="absolute top-2 right-2 min-w-[19px] h-[19px] px-1 rounded-[10px] bg-[rgb(244,67,54)] flex items-center justify-center border-2 border-white">
            <div className="text-[9px] font-black text-white">
              {badgeCount > 99 ? "99+" : badgeCount}
            </div>
          </div>
        ) : null}
      </div>
    </button>
  );
}

export default function LobbyQuickActions({
  onStartMatchSetup,
  onShowJoinCode,
  onShowFriends,
  onShowSocieties,
  onShowLeaderboard,
  onShowDailyQuiz,
  onShowReferral,
  friendsBadgeCount = 0,
}: {
  onStartMatchSetup: () => void;
  onShowJoinCode: () => void;
  onShowFriends: () => void;
  onShowSocieties: () => void;
  onShowLeaderboard: () => void;
  onShowDailyQuiz: () => void;
  onShowReferral: () => void;
  friendsBadgeCount?: number;
}) {
  return (
    <div className="px-[14px] pt-1 pb-2">
      <button
        onClick={onStartMatchSetup}
        className="w-full rounded-[24px] mb-3 bg-[#FFA726] shadow-lg shadow-[rgba(255,167,38,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all"
      >
        <div className="flex items-center px-6 py-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-[rgba(255,255,255,0.22)] flex items-center justify-center">
            <Play size={26} color="#fff" strokeWidth={3} />
          </div>
          <div className="flex-1 ml-4 text-left">
            <div className="text-[17px] font-black text-white uppercase tracking-tight">Start New Game</div>
            <div className="text-[10px] font-bold text-white/70 mt-0.5 tracking-widest uppercase">
              Challenge Friends or AI
            </div>
          </div>
        </div>
      </button>

      <div className="flex gap-[10px] mb-[10px]">
        <GridTile
          icon={BookOpen}
          color="#8B5CF6"
          label="Daily Quiz"
          sub="+120 PESA"
          onPress={onShowDailyQuiz}
        />
        <GridTile
          icon={Hash}
          color="#22C55E"
          label="Lobby Code"
          sub="Join Private"
          onPress={onShowJoinCode}
        />
      </div>

      <div className="flex gap-[10px]">
        <GridTile
          icon={Users}
          color="#6366F1"
          label="Societies"
          sub="Clans"
          onPress={onShowSocieties}
        />
        <GridTile
          icon={Users}
          color="#F97316"
          label="Friends"
          sub="Network"
          onPress={onShowFriends}
          badgeCount={friendsBadgeCount}
        />
        <GridTile
          icon={Trophy}
          color="#FACC15"
          label="Leader"
          sub="Rankings"
          onPress={onShowLeaderboard}
        />
      </div>

      <div className="flex gap-[10px] mt-[10px]">
        <GridTile
          icon={Gift}
          color="#D4AF37"
          label="Invite & Earn"
          sub="3 Tokens FREE"
          onPress={onShowReferral}
        />
        <div className="flex-1" /> {/* Spacer */}
      </div>
    </div>
  );
}
