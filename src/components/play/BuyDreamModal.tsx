"use client";

import React from "react";
import OverlayModal from "./OverlayModal";
import { Trophy, ArrowRight, ShieldAlert } from "lucide-react";

interface BuyDreamModalProps {
    open: boolean;
    onClose: () => void;
    dreamName: string;
    dreamCost: number;
    canDeclareWin: boolean;
    playerCash?: number;
    playerLiabilities?: number;
    onConfirm: () => void;
}

export default function BuyDreamModal({
    open,
    onClose,
    dreamName,
    dreamCost,
    canDeclareWin,
    playerCash = 0,
    playerLiabilities = 0,
    onConfirm,
}: BuyDreamModalProps) {
    const totalNeeded = dreamCost + playerLiabilities;
    const shortfall = Math.max(0, totalNeeded - playerCash);

    return (
        <OverlayModal open={open} onClose={onClose} title={`Purchase ${dreamName}`}>
            <div className="flex flex-col gap-6">
                <div className="flex justify-center py-4">
                    <div className="w-24 h-24 rounded-full bg-brand-gold/10 border-4 border-brand-gold flex items-center justify-center text-brand-gold animate-bounce">
                        <Trophy size={48} />
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-black text-brand-dark uppercase tracking-wide">{dreamName}</h3>
                    <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-tighter mt-1">
                        The ultimate achievement in PesaMali
                    </p>
                </div>

                <div className="bg-brand-dark/5 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                        <span className="text-brand-dark/60">Dream Cost</span>
                        <span className="text-brand-dark">{dreamCost.toLocaleString()} PTS</span>
                    </div>

                    {playerLiabilities > 0 && (
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                            <span className="text-brand-red/60">Outstanding Debts</span>
                            <span className="text-brand-red">+{playerLiabilities.toLocaleString()} PTS</span>
                        </div>
                    )}

                    <div className="h-[1px] bg-brand-dark/10" />

                    <div className="flex justify-between items-center text-sm font-black uppercase">
                        <span className="text-brand-dark">Total Required</span>
                        <span className="text-brand-gold">{totalNeeded.toLocaleString()} PTS</span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                        <span className="text-brand-dark/60">Your Liquid Cash</span>
                        <span className={playerCash >= totalNeeded ? "text-green-600" : "text-brand-red"}>
                            {playerCash.toLocaleString()} PTS
                        </span>
                    </div>
                </div>

                {!canDeclareWin && shortfall > 0 && (
                    <div className="p-3 rounded-xl bg-brand-red/5 border border-brand-red/10 flex items-center gap-3">
                        <ShieldAlert size={16} className="text-brand-red" />
                        <p className="text-[10px] font-black uppercase text-brand-red/60 leading-tight">
                            Insufficient funds. You need {shortfall.toLocaleString()} more Pesa Points to reach your dream.
                        </p>
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border-2 border-brand-dark/10 rounded-xl text-xs font-black uppercase tracking-widest text-brand-dark/40 hover:bg-brand-dark/5 transition-all"
                    >
                        Keep Grinding
                    </button>
                    <button
                        disabled={!canDeclareWin}
                        onClick={onConfirm}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${canDeclareWin
                                ? "bg-brand-gold text-brand-dark hover:bg-brand-gold-light"
                                : "bg-brand-dark/10 text-brand-dark/20 opacity-50 cursor-not-allowed"
                            }`}
                    >
                        {canDeclareWin ? (
                            <>
                                Confirm & Win
                                <Trophy size={14} />
                            </>
                        ) : "Locked"}
                    </button>
                </div>
            </div>
        </OverlayModal>
    );
}
