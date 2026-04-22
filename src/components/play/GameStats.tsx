"use client";

import React from "react";
import { User, Wallet, TrendingUp, TrendingDown, Target } from "lucide-react";
import type { PlayerState } from "@/types/game";

interface GameStatsProps {
    player: PlayerState;
    isCurrentTurn: boolean;
    variant?: 'default' | 'compact' | 'v2-mobile';
    currentUserId?: string;
}

export default function GameStats({ player, isCurrentTurn, variant = 'default', currentUserId }: GameStatsProps) {
    const isInDebt = player.onHandPoints < 0;
    const debtAmount = isInDebt ? Math.abs(player.onHandPoints) : player.liabilities;
    const assetsCount = player.assets.length;
    const maxAssets = 2; // Default for draft phase

    if (variant === 'v2-mobile') {
        const isMe = currentUserId === player.userId;
        return (
            <div className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${isCurrentTurn
                ? "bg-[#1e1e1e] border-brand-gold/60 shadow-[0_4px_20px_rgba(212,175,55,0.1)]"
                : "bg-[#181818] border-white/5"
                }`}>

                {/* Avatar Section */}
                <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isCurrentTurn ? "border-brand-gold animate-pulse" : "border-white/10"
                        }`}>
                        <div className={`w-7 h-7 rounded-full ${player.userId.includes('bot') ? 'bg-cyan-400' : 'bg-red-500'} shadow-lg flex items-center justify-center`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/90 uppercase tracking-tight truncate max-w-[80px]">{player.displayName}</span>
                            {isMe && (
                                <span className="text-[7px] font-black bg-[#fbb03b]/20 text-[#fbb03b] px-1 rounded-[2px] w-fit uppercase tracking-widest">YOU</span>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-center">
                            <div className="flex flex-col items-center">
                                <span className="text-[6px] font-black text-brand-gold/40 uppercase tracking-[1px]">Cash</span>
                                <span className="text-[10px] font-black text-brand-gold leading-none">{player.onHandPoints.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[6px] font-black text-emerald-500/40 uppercase tracking-[1px]">Savings</span>
                                <span className="text-[10px] font-black text-emerald-400 leading-none">{player.savings.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[6px] font-black text-red-500/40 uppercase tracking-[1px]">Debts</span>
                                <span className="text-[10px] font-black text-red-500 leading-none">{player.liabilities.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col items-center pr-2">
                                <span className="text-[6px] font-black text-cyan-400/40 uppercase tracking-[1px]">Assets</span>
                                <span className="text-[10px] font-black text-cyan-400 leading-none">{assetsCount}/2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'compact') {
        const playerColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'];
        const pIdx = player.userId.includes('bot') ? parseInt(player.userId.split('-')[1]) || 0 : 0;
        const color = playerColors[pIdx % 4];

        return (
            <div className={`flex flex-col items-center gap-2 p-3 rounded-[2rem] border transition-all shrink-0 min-w-[100px] relative overflow-hidden backdrop-blur-xl ${isCurrentTurn
                ? "bg-brand-gold/20 border-brand-gold/50 shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
                : "bg-brand-dark/40 border-brand-olive/10 opacity-80"
                }`}>
                <div className="relative">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${isCurrentTurn ? "scale-110 shadow-[0_0_15px] animate-pulse" : "border-brand-olive/20"
                        }`}
                        style={{
                            borderColor: isCurrentTurn ? color : 'transparent',
                            boxShadow: isCurrentTurn ? `0 0 15px ${color}40` : 'none'
                        }}
                    >
                        <div className="w-11 h-11 rounded-full bg-brand-dark/80 flex items-center justify-center text-brand-cream border border-white/5">
                            <User size={18} strokeWidth={2} style={{ color }} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className="text-[10px] font-black text-brand-cream uppercase truncate max-w-[80px] tracking-tight">{player.displayName}</div>
                    <div className="text-[11px] font-black text-brand-gold uppercase tracking-tighter mt-0.5">
                        {isInDebt ? `-$${debtAmount}` : `KES ${player.onHandPoints.toLocaleString()}`}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-4 rounded-[2rem] border transition-all duration-500 overflow-hidden relative group ${isCurrentTurn
            ? "bg-brand-gold/10 border-brand-gold shadow-[0_20px_40px_rgba(212,175,55,0.15)] ring-1 ring-brand-gold/20 scale-[1.02]"
            : "bg-brand-dark/40 border-brand-olive/10 opacity-70 hover:opacity-100 hover:border-brand-olive/30"
            }`}>

            <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCurrentTurn
                    ? "bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20"
                    : "bg-brand-dark/60 text-brand-gold/60 border border-brand-gold/20"
                    }`}>
                    <User size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-brand-cream truncate uppercase tracking-widest leading-none">
                            {player.displayName}
                        </h3>
                    </div>
                    <p className="text-[9px] text-brand-gold font-black uppercase tracking-[2px] mt-1 opacity-70">
                        {player.profession || "Competitor"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className={`p-3 rounded-2xl border transition-all ${isInDebt ? "bg-red-500/10 border-red-500/20" : "bg-black/20 border-white/5"
                    }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                        <Wallet size={12} className={isInDebt ? "text-red-500" : "text-brand-gold"} />
                        <span className="text-[9px] font-black text-brand-cream/30 uppercase tracking-widest">
                            {isInDebt ? "Debt" : "Points"}
                        </span>
                    </div>
                    <div className={`text-base font-black ${isInDebt ? "text-red-500" : "text-brand-cream"}`}>
                        {isInDebt ? `-${debtAmount.toLocaleString()}` : player.onHandPoints.toLocaleString()}
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                    <div className="flex items-center gap-2 mb-1.5">
                        <TrendingUp size={12} className="text-green-500" />
                        <span className="text-[9px] font-black text-brand-cream/30 uppercase tracking-widest">Savings</span>
                    </div>
                    <div className="text-base font-black text-green-500">
                        {player.savings.toLocaleString()}
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                    <div className="flex items-center gap-2 mb-1.5">
                        <TrendingDown size={12} className="text-red-500" />
                        <span className="text-[9px] font-black text-brand-cream/30 uppercase tracking-widest">Liabilities</span>
                    </div>
                    <div className="text-base font-black text-red-500">
                        {player.liabilities.toLocaleString()}
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Target size={12} className="text-brand-gold" />
                        <span className="text-[9px] font-black text-brand-cream/30 uppercase tracking-widest">Assets</span>
                    </div>
                    <div className="flex items-end gap-1.5">
                        <div className="text-base font-black text-brand-cream">
                            {assetsCount}
                        </div>
                        <div className="text-[10px] font-black text-brand-cream/20 mb-1">
                            / {maxAssets}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
