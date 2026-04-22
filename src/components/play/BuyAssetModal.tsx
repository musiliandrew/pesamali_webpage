"use client";

import React from "react";
import type { AssetCard, PlayerState } from "@/types/game";
import OverlayModal from "./OverlayModal";
import { DollarSign, TrendingUp } from "lucide-react";

interface BuyAssetModalProps {
    open: boolean;
    onClose: () => void;
    selectedAssets: string[];
    assetsPool: AssetCard[];
    playerPoints: number;
    onBuyAsset: (assetId: string) => void;
    ownedAssetIds: string[];
}

export default function BuyAssetModal({
    open,
    onClose,
    selectedAssets,
    assetsPool,
    playerPoints,
    onBuyAsset,
    ownedAssetIds,
}: BuyAssetModalProps) {
    const assets = selectedAssets
        .map((id) => assetsPool.find((a) => a.id === id))
        .filter((asset): asset is AssetCard => !!asset);

    const hasAffordableAssets = assets.some(
        (a) => playerPoints >= a.purchase_cost && !ownedAssetIds.includes(a.id)
    );

    return (
        <OverlayModal open={open} onClose={onClose} title="Marketplace">
            <div className="flex flex-col gap-4">
                <p className="text-center text-xs font-bold text-brand-dark/60 mb-2">
                    Select an asset to buy. This counts as your turn (no dice roll).
                </p>

                <div className="flex flex-col gap-3">
                    {assets.map((asset) => {
                        const isOwned = ownedAssetIds.includes(asset.id);
                        const affordable = playerPoints >= asset.purchase_cost;
                        const totalReturn = asset.profit_per_return * asset.max_returns;
                        const isDisabled = isOwned || !affordable;

                        return (
                            <button
                                key={asset.id}
                                disabled={isDisabled}
                                onClick={() => onBuyAsset(asset.id)}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${isOwned
                                        ? "bg-brand-dark/5 border-brand-dark/10 opacity-50"
                                        : affordable
                                            ? "bg-white border-green-200 hover:border-green-400 group"
                                            : "bg-brand-dark/5 border-brand-dark/5 opacity-80"
                                    }`}
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <h4 className="text-sm font-black text-brand-dark uppercase truncate">
                                        {asset.name} {isOwned && "✓"}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-brand-dark/40 uppercase">
                                            <TrendingUp size={10} className="text-green-600" />
                                            Yield: {asset.profit_per_return} × {asset.max_returns}
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-green-700 mt-0.5">
                                        Total Potential: {totalReturn} pts
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <div className={`px-2 py-1 rounded-lg text-[11px] font-black ${affordable && !isOwned ? "bg-green-100 text-green-700" : "bg-brand-dark/10 text-brand-dark/40"
                                        }`}>
                                        {asset.purchase_cost} PTS
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-tighter opacity-70">
                                        {isOwned ? "Owned" : affordable ? "Tap to Buy" : "Locked"}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {assets.length === 0 && (
                    <div className="py-12 text-center text-brand-dark/30 font-bold uppercase tracking-widest text-xs">
                        No assets in sight...
                    </div>
                )}

                {!hasAffordableAssets && assets.length > 0 && (
                    <div className="p-3 rounded-xl bg-brand-red/5 border border-brand-red/10 text-center text-[10px] font-bold text-brand-red/60 uppercase">
                        Insufficient Pesa Points to expand your portfolio
                    </div>
                )}
            </div>
        </OverlayModal>
    );
}
