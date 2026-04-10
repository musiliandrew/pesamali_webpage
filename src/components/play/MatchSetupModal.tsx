"use client";

import { Dispatch, SetStateAction } from "react";
import OverlayModal from "@/components/play/OverlayModal";
import DreamCarousel, { WebDream } from "@/components/play/DreamCarousel";

export type GameMode = "ai" | "online" | "private";

export default function MatchSetupModal({
  open,
  onClose,
  dreams,
  selectedDreamId,
  setSelectedDreamId,
  gameMode,
  setGameMode,
  playerCount,
  setPlayerCount,
  onStart,
  starting,
}: {
  open: boolean;
  onClose: () => void;
  dreams: WebDream[];
  selectedDreamId: string;
  setSelectedDreamId: Dispatch<SetStateAction<string>>;
  gameMode: GameMode;
  setGameMode: Dispatch<SetStateAction<GameMode>>;
  playerCount: number;
  setPlayerCount: Dispatch<SetStateAction<number>>;
  onStart: () => void;
  starting: boolean;
}) {
  const modes: Array<{ mode: GameMode; emoji: string; label: string; sub: string }> = [
    { mode: "ai", emoji: "🤖", label: "AI Mode", sub: "Practice vs AI" },
    { mode: "online", emoji: "🌐", label: "Quick Play", sub: "Match online" },
    { mode: "private", emoji: "👥", label: "Private", sub: "Invite friends" },
  ];

  const counts: Array<{ count: number; label: string }> = [
    { count: 2, label: "2 players" },
    { count: 3, label: "3-way" },
    { count: 4, label: "4 players" },
  ];

  return (
    <OverlayModal open={open} onClose={onClose} title="" maxWidthClassName="max-w-lg">
      <div className="text-center pb-2">
        <div className="text-xs font-extrabold tracking-widest text-brand-dark/60">
          SETUP MATCH
        </div>
        <div className="text-2xl font-black text-brand-dark mt-1">Start New Game</div>
        <div className="text-sm font-semibold text-brand-dark/60 mt-2">
          Choose mode, players, and your dream.
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-extrabold uppercase tracking-wider text-brand-dark/60 mb-2">
          Game Mode
        </div>
        <div className="grid grid-cols-3 gap-3">
          {modes.map((m) => {
            const active = gameMode === m.mode;
            return (
              <button
                key={m.mode}
                onClick={() => setGameMode(m.mode)}
                className={
                  "rounded-2xl border-2 px-3 py-4 text-left transition " +
                  (active
                    ? "border-brand-gold bg-[rgba(212,168,67,0.15)]"
                    : "border-[rgba(139,115,85,0.25)] bg-white")
                }
              >
                <div className="text-2xl">{m.emoji}</div>
                <div className="text-sm font-black text-brand-dark mt-2">
                  {m.label}
                </div>
                <div className="text-[10px] font-bold text-brand-dark/60 mt-1">
                  {m.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-extrabold uppercase tracking-wider text-brand-dark/60 mb-2">
          Players
        </div>
        <div className="grid grid-cols-3 gap-3">
          {counts.map((c) => {
            const active = playerCount === c.count;
            return (
              <button
                key={c.count}
                onClick={() => setPlayerCount(c.count)}
                className={
                  "rounded-2xl border-[2.5px] px-3 py-4 transition font-black text-sm " +
                  (active
                    ? "border-brand-gold bg-[rgba(212,168,67,0.12)] text-brand-dark"
                    : "border-[rgba(139,115,85,0.22)] bg-white text-brand-dark/80")
                }
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs font-extrabold uppercase tracking-wider text-brand-dark/60 mb-2">
          Select Dream
        </div>
        <DreamCarousel
          dreams={dreams}
          selectedDreamId={selectedDreamId}
          onSelectDream={setSelectedDreamId}
        />
      </div>

      <button
        onClick={onStart}
        disabled={starting || !selectedDreamId}
        className="mt-6 w-full rounded-2xl bg-[#FFA726] hover:brightness-105 disabled:opacity-60 transition shadow-lg shadow-[rgba(255,167,38,0.25)]"
      >
        <div className="px-6 py-5 text-center text-white font-black text-lg tracking-wide">
          {starting ? "Starting…" : "🎮 Start"}
        </div>
      </button>

      <button
        onClick={onClose}
        className="mt-3 w-full text-sm text-brand-dark/60 hover:text-brand-dark transition font-semibold"
      >
        Cancel
      </button>
    </OverlayModal>
  );
}
