"use client";

import { Bell, Settings, ArrowLeft, Gift } from "lucide-react";

export default function AppHeader({
  displayName,
  profession,
  unreadCount = 0,
  onPressNotifications,
  onPressProfile,
  onPressInvite,
  showBackButton = false,
  onPressBack,
  title,
}: {
  displayName: string;
  profession?: string | null;
  unreadCount?: number;
  onPressNotifications?: () => void;
  onPressProfile?: () => void;
  onPressInvite?: () => void;
  showBackButton?: boolean;
  onPressBack?: () => void;
  title?: string;
}) {
  const hasUnread = unreadCount > 0;

  return (
    <div
      className="px-5 pt-4 pb-4 border-b border-[rgba(45,80,22,0.10)] shadow-sm"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,252,255,0.90))",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBackButton && onPressBack ? (
            <button
              onClick={onPressBack}
              className="w-10 h-10 rounded-full bg-[rgb(255,254,248)] border border-[rgb(245,222,179)] shadow-sm flex items-center justify-center"
            >
              <ArrowLeft size={22} color="#1F2937" />
            </button>
          ) : null}

          {title ? (
            <div className="text-xl font-extrabold text-[rgb(26,26,26)] truncate">{title}</div>
          ) : (
            <>
              <div className="w-11 h-11 rounded-full bg-[rgba(45,80,22,0.10)] border border-[rgba(212,175,55,0.35)] flex items-center justify-center shrink-0">
                <div className="text-sm font-black text-[rgb(45,80,22)]">
                  {(displayName || "P").slice(0, 1).toUpperCase()}
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-base font-bold text-[rgb(26,26,26)] truncate">
                  {displayName}
                </div>
                {profession ? (
                  <div className="text-[11px] font-semibold text-[rgb(45,80,22)] uppercase tracking-wider truncate">
                    {profession}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {onPressNotifications ? (
            <button
              onClick={onPressNotifications}
              className="w-11 h-11 rounded-full bg-[rgb(255,254,248)] border border-[rgb(245,222,179)] shadow-sm flex items-center justify-center relative"
            >
              <Bell size={22} color="#1F2937" />
              {hasUnread ? (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[rgb(244,67,54)] border-2 border-[rgb(255,254,248)]" />
              ) : null}
            </button>
          ) : null}

          {onPressInvite ? (
            <button
              onClick={onPressInvite}
              className="w-11 h-11 rounded-full bg-brand-gold/10 border border-brand-gold/30 shadow-sm flex items-center justify-center group hover:bg-brand-gold/20 transition"
            >
              <Gift size={20} className="text-brand-gold group-hover:scale-110 transition" />
            </button>
          ) : null}

          {onPressProfile ? (
            <button
              onClick={onPressProfile}
              className="w-11 h-11 rounded-full bg-[rgb(255,254,248)] border border-[rgb(245,222,179)] shadow-sm flex items-center justify-center"
            >
              <Settings size={22} color="#6B7280" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
