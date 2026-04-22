"use client";

import React from "react";
import OverlayModal from "./OverlayModal";
import type { AssetCard, PlayerAsset } from "@/types/game";
import { Briefcase, CheckCircle2, Clock, TrendingUp } from "lucide-react";

interface MyAssetsModalProps {
    open: boolean;
    onClose: () => void;
    assets: PlayerAsset[];
    assetsPool: AssetCard[];
}

export default function MyAssetsModal({
    open,
    onClose,
    assets,
    assetsPool,
}: MyAssetsModalProps) {
    const ownedAssets = assets.map((playerAsset) => {
        const details = assetsPool.find((a) => a.id === playerAsset.assetId);
        return {
            ...playerAsset,
            details,
        };
    });

    return (
        <OverlayModal open={open} onClose={onClose} title="Portfolio Overview" maxWidthClassName="max-w-lg">
            <div className="flex flex-col gap-4">
                {ownedAssets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-brand-dark/5 flex items-center justify-center text-brand-dark/20 mb-4">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest">No Assets Yet</h3>
                        <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-tighter mt-1">
                            Start building your empire by purchasing assets from the marketplace!
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
                        {ownedAssets.map((asset, index) => {
                            const maxReturns = asset.details?.max_returns || 5;
                            const progress = (asset.returnsCollected / maxReturns) * 100;
                            const isComplete = asset.returnsCollected >= maxReturns;

                            return (
                                <div
                                    key={asset.assetId}
                                    className="bg-white border-2 border-brand-dark/5 rounded-2xl p-4 shadow-sm hover:border-brand-gold/30 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h4 className="text-sm font-black text-brand-dark uppercase truncate group-hover:text-brand-gold transition-colors">
                                                {asset.details?.name || "Unknown Asset"}
                                            </h4>
                                            <p className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-tighter mt-0.5">
                                                Acquired on Turn {asset.purchasedOnTurn}
                                            </p>
                                        </div>
                                        {isComplete ? (
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[9px] font-black uppercase">
                                                <CheckCircle2 size={10} />
                                                Matured
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-[9px] font-black uppercase">
                                                <Clock size={10} className="animate-spin-slow" />
                                                Yielding
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5 mb-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                                            <span className="text-brand-dark/40">Returns Progress</span>
                                            <span className="text-brand-dark">{asset.returnsCollected} / {maxReturns}</span>
                                        </div>
                                        <div className="h-2 bg-brand-dark/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${isComplete ? 'bg-green-500' : 'bg-brand-gold'}`}
                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-brand-dark/5 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-brand-dark/30 uppercase tracking-widest">Yield Per Turn</span>
                                            <div className="flex items-center gap-1 text-[11px] font-black text-green-600">
                                                <TrendingUp size={12} />
                                                +{asset.details?.profit_per_return || 0} PTS
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] font-black text-brand-dark/30 uppercase tracking-widest">Expected Total</span>
                                            <span className="text-[11px] font-black text-brand-dark">
                                                {((asset.details?.profit_per_return || 0) * maxReturns).toLocaleString()} PTS
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full py-4 mt-2 bg-brand-dark text-brand-cream rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-dark/90 transition-all border border-brand-olive/30 shadow-xl active:scale-[0.98]"
                >
                    Close Dashboard
                </button>
            </div>
        </OverlayModal>
    );
}
