"use client";

import { useEffect, useState, useMemo } from "react";
import OverlayModal from "./OverlayModal";
import { Trophy, Medal, Crown, Star, TrendingUp, Filter } from "lucide-react";
import { getApiBaseUrl } from "@/lib/env";
import { getToken } from "@/lib/auth";

type LeaderboardEntry = {
    rank: number;
    user_id: string;
    display_name: string;
    pesa_points: number;
    tier: string;
    avatar?: string;
};

export default function LeaderboardModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [tier, setTier] = useState<string>("Global");
    const [period, setPeriod] = useState<"all_time" | "monthly" | "weekly">("all_time");

    const apiBase = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!open) return;
        fetchLeaderboard();
    }, [open, tier, period]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const url = new URL(`${apiBase}/api/points/leaderboard`);
            if (tier !== "Global") url.searchParams.set("tier", tier);
            url.searchParams.set("period", period);

            const res = await fetch(url.toString(), {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setLeaderboard(data.leaderboard || []);
            }
        } catch { } finally {
            setLoading(false);
        }
    };

    return (
        <OverlayModal open={open} onClose={onClose} title="Champions Leaderboard" maxWidthClassName="max-w-lg">
            <div className="flex flex-col gap-4">
                {/* Filters */}
                <div className="flex flex-col gap-3">
                    <div className="flex bg-black/5 p-1 rounded-xl">
                        {["Global", "Elite", "Gold", "Silver", "Bronze"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTier(t)}
                                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter rounded-lg transition ${tier === t ? "bg-white shadow-sm text-brand-green" : "text-brand-dark/40"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-black/5 p-1 rounded-xl">
                        {[
                            { id: "all_time", label: "All Time" },
                            { id: "monthly", label: "Monthly" },
                            { id: "weekly", label: "Weekly" },
                        ].map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPeriod(p.id as any)}
                                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition ${period === p.id ? "bg-brand-gold text-white shadow-md shadow-brand-gold/20" : "text-brand-dark/40"
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center animate-pulse">
                        <Trophy size={40} className="mx-auto mb-4 text-brand-gold/20" />
                        <div className="text-xs font-black uppercase tracking-widest text-brand-dark/20">Loading Champions...</div>
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="py-20 text-center text-sm font-bold text-brand-dark/40">
                        No rankings available for this category.
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1 no-scrollbar">
                        {leaderboard.map((entry, idx) => (
                            <div
                                key={entry.user_id}
                                className={`flex items-center gap-3 p-3 rounded-2xl transition-all border ${idx === 0 ? 'bg-brand-gold/5 border-brand-gold/20' : 'bg-white border-black/[0.03]'
                                    }`}
                            >
                                <div className="w-8 flex items-center justify-center font-black italic text-lg text-brand-dark/30">
                                    {entry.rank === 1 ? <Crown className="text-brand-gold" size={24} /> :
                                        entry.rank === 2 ? <Medal className="text-silver-500" size={20} /> :
                                            entry.rank === 3 ? <Medal className="text-orange-500" size={20} /> :
                                                `#${entry.rank}`}
                                </div>

                                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-black text-brand-dark/20">
                                    {(entry.display_name || "?").charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-black text-brand-dark uppercase tracking-tight truncate">{entry.display_name}</div>
                                    <div className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-wider">{entry.tier} Rank</div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm font-black text-brand-green">{entry.pesa_points.toLocaleString()}</div>
                                    <div className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-tighter">Points</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* My Position Mockup */}
                <div className="mt-2 p-4 rounded-2xl bg-brand-green text-white shadow-lg shadow-brand-green/20 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black">
                        ME
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-black uppercase tracking-wider line-clamp-1">Your Standing</div>
                        <div className="text-[10px] font-bold opacity-80 uppercase">Keep playing to reach the top!</div>
                    </div>
                    <TrendingUp size={24} className="opacity-50" />
                </div>
            </div>
        </OverlayModal>
    );
}
