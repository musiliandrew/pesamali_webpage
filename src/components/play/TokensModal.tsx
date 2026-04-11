"use client";

import { Info, Zap, Share2, Award, Coins } from "lucide-react";
import OverlayModal from "./OverlayModal";

export default function TokensModal({
    open,
    onClose,
    tokens = 0,
    onGoToQuiz,
}: {
    open: boolean;
    onClose: () => void;
    tokens?: number;
    onGoToQuiz?: () => void;
}) {
    return (
        <OverlayModal open={open} onClose={onClose} title="Pesa Tokens" maxWidthClassName="max-w-md">
            <div className="flex flex-col gap-6">
                {/* Balance Display */}
                <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] p-6 rounded-[32px] text-white shadow-xl shadow-purple-500/20 text-center">
                    <div className="text-[11px] font-black uppercase tracking-[3px] opacity-70 mb-2">Your Balance</div>
                    <div className="text-5xl font-black mb-1 flex items-center justify-center gap-3">
                        <span className="text-3xl">💎</span> {tokens}
                    </div>
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-2 px-4">
                        Used to enter tournaments, play matches, and take daily quizzes
                    </div>
                </div>

                {/* Ways to Earn */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <Zap className="text-brand-gold" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Ways to Earn More</span>
                    </div>

                    <button
                        onClick={() => { onGoToQuiz?.(); onClose(); }}
                        className="w-full bg-white border border-black/[0.03] p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:border-brand-gold/30 transition group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition">
                            <Award size={24} />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-black text-brand-dark uppercase tracking-tight">Daily Quiz</div>
                            <div className="text-[10px] font-bold text-brand-dark/40 uppercase">Earn up to 120 Pesa daily</div>
                        </div>
                        <div className="text-brand-purple text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition flex items-center">
                            Play 💎
                        </div>
                    </button>

                    <button
                        className="w-full bg-white border border-black/[0.03] p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:border-brand-gold/30 transition group"
                        onClick={() => alert("Referral system coming soon to web!")}
                    >
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
                            <Share2 size={24} />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-black text-brand-dark uppercase tracking-tight">Invite Friends</div>
                            <div className="text-[10px] font-bold text-brand-dark/40 uppercase">Get 50 Tokens per referral</div>
                        </div>
                        <div className="text-blue-500 text-[10px] font-black uppercase tracking-widest">
                            +50 💎
                        </div>
                    </button>
                </div>

                {/* Info Box */}
                <div className="bg-black/5 p-5 rounded-2xl flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-brand-dark/40 shrink-0">
                        <Info size={20} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black uppercase tracking-tight text-brand-dark">About Tokens</div>
                        <p className="text-[10px] font-bold text-brand-dark/50 leading-relaxed mt-1 uppercase">
                            Tokens are purely for in-game participation. They cannot be withdrawn but help you grow your Pesa Profile Rank and visibility on Leaderboards.
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl bg-brand-dark text-white text-[11px] font-black uppercase tracking-widest hover:bg-black active:scale-[0.98] transition"
                >
                    Got It
                </button>
            </div>
        </OverlayModal>
    );
}
