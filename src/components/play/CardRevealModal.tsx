"use client";

import React, { useEffect, useState } from "react";
import type { PlayingCard, PlayerState } from "@/types/game";
import OverlayModal from "./OverlayModal";

interface CardRevealModalProps {
    open: boolean;
    card: PlayingCard | null;
    player?: PlayerState | null;
    onClose: () => void;
    onPlaySavingsSpending?: () => void;
}

export default function CardRevealModal({
    open,
    card,
    player,
    onClose,
    onPlaySavingsSpending,
}: CardRevealModalProps) {
    const [autoDismissing, setAutoDismissing] = useState(false);
    const hasCards = (player?.savingsCards?.length || 0) > 0 || (player?.spendingCards?.length || 0) > 0;

    useEffect(() => {
        if (open && !hasCards) {
            setAutoDismissing(true);
            const timer = setTimeout(() => {
                onClose();
                setAutoDismissing(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [open, hasCards, onClose]);

    if (!card) return null;

    const isGain = card.type === "gain" || card.delta > 0;
    const absAmount = Math.abs(card.delta || 0);

    return (
        <OverlayModal open={open} onClose={onClose} maxWidthClassName="max-w-xs">
            <div className={`rounded-xl border-4 overflow-hidden shadow-2xl ${isGain ? "border-green-500" : "border-red-500"
                }`}>
                <div className={`p-6 text-center text-white font-black uppercase tracking-widest ${isGain ? "bg-green-500" : "bg-red-500"
                    }`}>
                    {isGain ? "💰 Income" : "⚠️ Expense"}
                </div>

                <div className="p-8 bg-brand-cream flex flex-col items-center gap-6">
                    <div className={`px-8 py-4 rounded-full text-4xl font-black text-white shadow-lg ${isGain ? "bg-green-500" : "bg-red-500"
                        }`}>
                        {isGain ? "+" : "-"}{absAmount}
                    </div>

                    <div className="text-xl font-black text-brand-dark text-center leading-tight">
                        {card.label}
                    </div>

                    <div className="w-full h-[2px] bg-brand-dark/5" />

                    <div className="text-center px-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 block mb-1">
                            Effect Applied to {player?.displayName || "Player"}
                        </span>
                        <p className="text-sm font-bold text-brand-dark">
                            {isGain
                                ? `${player?.displayName || "They"} gained ${absAmount} Pesa Points!`
                                : `${player?.displayName || "They"} lost ${absAmount} Pesa Points`}
                        </p>
                    </div>

                    {hasCards ? (
                        <div className="w-full flex flex-col gap-3 mt-4">
                            {onPlaySavingsSpending && (
                                <button
                                    onClick={onPlaySavingsSpending}
                                    className="w-full py-3 bg-brand-dark text-brand-cream font-black uppercase tracking-wider text-xs rounded-xl hover:bg-brand-dark/90 transition-all"
                                >
                                    Play Savings/Spending
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-brand-gold text-brand-dark font-black uppercase tracking-wider text-xs rounded-xl hover:bg-brand-gold-light transition-all"
                            >
                                Skip & Continue
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4 text-[10px] font-bold text-brand-dark/30 animate-pulse uppercase tracking-widest">
                            Auto-continuing...
                        </div>
                    )}
                </div>
            </div>
        </OverlayModal>
    );
}
