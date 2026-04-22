"use client";

import React, { useState, useEffect } from "react";
import type { AssetCard, PlayerState } from "@/types/game";
import OverlayModal from "./OverlayModal";
import { Briefcase, CheckCircle, Clock, Lock, Sparkles, TrendingUp, DollarSign } from "lucide-react";

interface AssetDraftModalProps {
    open: boolean;
    onClose: () => void;
    isMyTurn: boolean;
    availableAssets: AssetCard[];
    currentPickerName: string;
    myAssetsCount: number;
    isSubmitting: boolean;
    onConfirm: (assetId: string) => void;
}

export default function AssetDraftModal({
    open,
    onClose,
    isMyTurn,
    availableAssets,
    currentPickerName,
    myAssetsCount,
    isSubmitting,
    onConfirm,
}: AssetDraftModalProps) {
    const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);

    // Reset local selection when modal opens or turn changes
    useEffect(() => {
        if (open) {
            setLocalSelectedId(null);
        }
    }, [open, isMyTurn]);

    if (!open) return null;

    const progress = (myAssetsCount / 2) * 100;

    const getInstructions = () => {
        if (isMyTurn) {
            if (myAssetsCount === 0) return { text: "Choose your first asset to start your empire!", icon: Sparkles };
            if (myAssetsCount === 1) return { text: "Final pick! Choose wisely to complete your portfolio.", icon: Briefcase };
            return { text: "Ready to go! Confirm your selection.", icon: CheckCircle };
        }
        return { text: `Waiting for ${currentPickerName} to make a move...`, icon: Clock };
    };

    const handleAssetPress = (assetId: string) => {
        if (!isMyTurn) return;
        setLocalSelectedId(prev => (prev === assetId ? null : assetId));
    };

    const getAssetCategory = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('estate') || lower.includes('apartment') || lower.includes('plot') || lower.includes('real')) return { label: 'Real Estate', color: 'bg-amber-500', icon: '🏠', gradient: 'from-amber-600/20 to-amber-900/40' };
        if (lower.includes('stock') || lower.includes('bond') || lower.includes('shares') || lower.includes('equity')) return { label: 'Stocks & Bonds', color: 'bg-blue-500', icon: '📈', gradient: 'from-blue-600/20 to-blue-900/40' };
        if (lower.includes('business') || lower.includes('shop') || lower.includes('retail') || lower.includes('start')) return { label: 'Business', color: 'bg-emerald-500', icon: '💼', gradient: 'from-emerald-600/20 to-emerald-900/40' };
        if (lower.includes('agri') || lower.includes('farm') || lower.includes('land')) return { label: 'Agriculture', color: 'bg-lime-600', icon: '🚜', gradient: 'from-lime-600/20 to-lime-900/40' };
        return { label: 'Venture', color: 'bg-purple-500', icon: '🚀', gradient: 'from-purple-600/20 to-purple-900/40' };
    };

    return (
        <OverlayModal open={open} onClose={onClose} title="Initial Asset Selection" maxWidthClassName="max-w-[480px]" dark={true}>
            <div className="flex flex-col gap-4 sm:gap-5 max-h-[85vh] p-5">
                <style jsx global>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    @keyframes card-reveal {
                        0% { transform: scale(1) rotateY(0deg); }
                        50% { transform: scale(1.1) rotateY(180deg); }
                        100% { transform: scale(1.04) rotateY(360deg); }
                    }
                    .animate-card-reveal {
                        animation: card-reveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                `}</style>

                {/* Progress Header */}
                <div className="relative p-5 rounded-[2rem] bg-[#0a1f1a] border-2 border-brand-gold/20 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/felt.png")' }} />
                    <div className="relative z-10 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isMyTurn ? 'bg-brand-gold animate-pulse shadow-[0_0_10px_#d4af37]' : 'bg-white/20'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-[2px] ${isMyTurn ? 'text-brand-gold' : 'text-white/40'}`}>
                                    {isMyTurn ? "Your Strategy" : `Waiting for ${currentPickerName}`}
                                </span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[2px] text-white/40">{myAssetsCount}/2 PESA PICKS</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                            <div className="h-full bg-gradient-to-r from-brand-gold to-yellow-200 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(212,175,55,0.4)]" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>

                {/* Asset Selection Carousel - "Trading Card" style */}
                <div className="flex flex-col gap-4">
                    {!availableAssets || availableAssets.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white/5 rounded-[2.5rem] border border-white/10 animate-pulse">
                            <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center">
                                <Clock size={24} className="text-brand-gold" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[2px] text-white/40">Synchronizing Market Data...</p>
                        </div>
                    ) : (
                        <div className="flex items-stretch gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar py-4 px-1">
                            {availableAssets.map((asset) => {
                                const isSelected = localSelectedId === asset.id;
                                const canSelect = isMyTurn;
                                const cat = getAssetCategory(asset.name || "Unknown Asset");
                                const roi = asset.purchase_cost > 0
                                    ? Math.round((asset.profit_per_return * asset.max_returns / asset.purchase_cost) * 100)
                                    : 0;

                                return (
                                    <button
                                        key={asset.id}
                                        disabled={!canSelect}
                                        onClick={() => handleAssetPress(asset.id)}
                                        className={`group relative flex-none w-[290px] snap-center flex flex-col rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden [perspective:1000px] ${isSelected
                                            ? "border-brand-gold bg-[#0e251f] shadow-[0_30px_60px_rgba(212,175,55,0.4),inset_0_0_40px_rgba(212,175,55,0.1)] scale-[1.04] z-10 animate-card-reveal"
                                            : canSelect
                                                ? "border-white/10 bg-[#0a1412] hover:border-white/30 hover:bg-[#0f1f1b] active:scale-95 shadow-xl"
                                                : "border-transparent bg-white/5 opacity-40 grayscale pointer-events-none"
                                            }`}
                                    >
                                        {/* Card Header with category & Glaze Effect */}
                                        <div className={`h-36 bg-gradient-to-br ${cat.gradient} relative flex items-center justify-center overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black/30" />
                                            {/* Diagonal Shine - Metallic Glaze */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                                            <span className="text-7xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-125 group-hover:rotate-6">{cat.icon}</span>

                                            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                                                <div className={`w-2 h-2 rounded-full ${cat.color} shadow-[0_0_10px_currentColor]`} />
                                                <span className="text-[9px] font-black uppercase tracking-[2px] text-white/80">{cat.label}</span>
                                            </div>

                                            {isSelected && (
                                                <div className="absolute top-6 right-6 w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-brand-dark shadow-[0_10px_30px_rgba(212,175,55,0.6)] animate-in zoom-in duration-500 ring-4 ring-brand-gold/20">
                                                    <CheckCircle size={28} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6 flex flex-col gap-5 flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat opacity-90">
                                            <div className="flex flex-col gap-1.5">
                                                <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-brand-gold transition-colors drop-shadow-md">
                                                    {asset.name || "Premium Asset"}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold text-[8px] font-black uppercase tracking-widest">Mobile V2 Prime</span>
                                                    <div className="h-[1px] flex-1 bg-white/10" />
                                                </div>
                                            </div>

                                            {/* Main Stats Badges */}
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center justify-between bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-4 shadow-inner group-hover:bg-brand-gold/20 transition-all">
                                                    <span className="text-[9px] font-black text-brand-gold/60 uppercase tracking-widest">Entry PESA</span>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign size={12} className="text-brand-gold" />
                                                        <span className="text-lg font-black text-brand-gold">{asset.purchase_cost.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 shadow-inner group-hover:bg-emerald-500/20 transition-all">
                                                    <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Yield/Cycle</span>
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp size={12} className="text-emerald-500" />
                                                        <span className="text-lg font-black text-emerald-500">+{asset.profit_per_return}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer Info Row */}
                                            <div className="mt-auto flex items-center justify-between px-2 pt-2 border-t border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black uppercase text-white/20 tracking-[2px]">Maturity</span>
                                                    <span className="text-[11px] font-black text-white/60">{asset.max_returns} Returns</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[8px] font-black uppercase text-white/20 tracking-[2px]">Efficiency</span>
                                                    <span className={`text-[11px] font-black ${roi > 100 ? 'text-emerald-400' : 'text-brand-gold'}`}>{roi}% ROI</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Confirmation */}
                <div className="pt-2 sm:pt-4 border-t border-brand-dark/10">
                    <button
                        onClick={() => localSelectedId && onConfirm(localSelectedId)}
                        disabled={!isMyTurn || !localSelectedId || isSubmitting}
                        className={`w-full py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] font-black uppercase tracking-[2px] sm:tracking-[4px] text-xs sm:text-sm transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden ${!isMyTurn || !localSelectedId || isSubmitting
                            ? "bg-brand-dark/10 text-brand-dark/20 cursor-not-allowed shadow-none"
                            : "bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark shadow-[0_15px_35px_rgba(0,0,0,0.1)]"
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/20 border-t-white rounded-full" />
                        ) : (
                            <>
                                Confirm Pick ({myAssetsCount + 1}/2)
                                <CheckCircle size={18} sm-size={20} className="group-hover:scale-125 transition-transform" />
                            </>
                        )}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>

            </div>
        </OverlayModal>
    );
}
