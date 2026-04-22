"use client";

import { useEffect, useState, useMemo } from "react";
import { Info, Zap, Share2, Award, Coins, Smartphone, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import OverlayModal from "./OverlayModal";
import { getApiBaseUrl } from "@/lib/env";
import { getToken } from "@/lib/auth";

type TokenPackage = {
    id: string;
    name: string;
    description: string;
    price_kes: number;
    total_tokens: number;
};

export default function TokensModal({
    open,
    onClose,
    tokens = 0,
    onGoToQuiz,
    onRefresh,
}: {
    open: boolean;
    onClose: () => void;
    tokens?: number;
    onGoToQuiz?: () => void;
    onRefresh?: () => void;
}) {
    const [packages, setPackages] = useState<TokenPackage[]>([]);
    const [loading, setLoading] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [purchaseReference, setPurchaseReference] = useState<string | null>(null);
    const [purchasingId, setPurchasingId] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const apiBase = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!open) return;
        fetchPackages();
    }, [open]);

    const fetchPackages = async () => {
        try {
            const res = await fetch(`${apiBase}/api/tokens/packages`);
            if (res.ok) setPackages(await res.json());
        } catch { }
    };

    const handleClaimDaily = async () => {
        setClaiming(true);
        try {
            const res = await fetch(`${apiBase}/api/tokens/claim-daily`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await res.json();
            alert(data.message);
            if (data.success) onRefresh?.();
        } catch {
            alert("Failed to claim token");
        } finally {
            setClaiming(false);
        }
    };

    const handleInitiatePurchase = async (pkg: TokenPackage) => {
        if (!phoneNumber || phoneNumber.length < 10) {
            alert("Please enter a valid M-Pesa phone number");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/tokens/purchase/initiate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    package_id: pkg.id,
                    phone_number: phoneNumber
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPurchaseReference(data.reference);
                setPurchasingId(pkg.id);
                setStatusMessage("Waiting for STK Push confirmation...");
                // Start polling
                pollStatus(data.reference);
            } else {
                alert(data.message || "Failed to initiate purchase");
            }
        } catch {
            alert("Network error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const pollStatus = async (ref: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${apiBase}/api/tokens/purchase/status/${ref}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                const data = await res.json();
                if (data.status === "success") {
                    clearInterval(interval);
                    setStatusMessage("Success! Tokens credited.");
                    onRefresh?.();
                    setTimeout(() => {
                        setPurchaseReference(null);
                        setPurchasingId(null);
                        setStatusMessage(null);
                    }, 3000);
                } else if (data.status === "error") {
                    clearInterval(interval);
                    setStatusMessage("Payment failed. Please try again.");
                    setTimeout(() => setStatusMessage(null), 3000);
                    setPurchaseReference(null);
                }
            } catch { }
        }, 3000);
        setTimeout(() => clearInterval(interval), 60000); // 1 minute timeout
    };

    return (
        <OverlayModal open={open} onClose={onClose} title="Pesa Tokens" maxWidthClassName="max-w-md">
            <div className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto no-scrollbar pr-1">
                {/* Balance Display */}
                <div className="bg-gradient-to-br from-[#10b981] to-[#0a1f1a] p-6 rounded-[32px] text-white shadow-xl shadow-emerald-500/20 text-center border border-white/10 shrink-0">
                    <div className="text-[11px] font-black uppercase tracking-[3px] opacity-70 mb-2">Your Balance</div>
                    <div className="text-5xl font-black mb-1 flex items-center justify-center gap-3">
                        <span className="text-3xl filter drop-shadow-lg">💎</span> {tokens}
                    </div>
                </div>

                {/* Daily Claim - Only if 0 tokens */}
                {tokens === 0 && (
                    <div className="bg-brand-gold/10 border-2 border-brand-gold/20 p-5 rounded-3xl flex flex-col gap-3 animate-pulse-subtle">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-gold rounded-xl text-white">
                                <Zap size={18} fill="currentColor" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-black uppercase tracking-tight text-brand-dark">Claim Free Token</div>
                                <div className="text-[9px] font-bold text-brand-dark/40 uppercase">Get 1 💎 every 24 hours</div>
                            </div>
                            <button
                                onClick={handleClaimDaily}
                                disabled={claiming}
                                className="px-4 py-2 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                            >
                                {claiming ? "..." : "Claim"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Token Packages */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Coins className="text-brand-gold" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Buy Token Packages</span>
                    </div>

                    {/* M-Pesa Input if purchasing */}
                    {purchasingId && (
                        <div className="p-4 bg-white border-2 border-brand-gold rounded-2xl animate-in slide-in-from-top-4 duration-300">
                            <div className="text-[10px] font-black uppercase text-brand-dark/40 mb-2">M-Pesa Phone Number</div>
                            <div className="flex gap-2">
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="2547XXXXXXXX"
                                    className="flex-1 px-4 py-3 rounded-xl bg-black/5 border-none text-sm font-bold outline-none"
                                />
                                <button
                                    onClick={() => handleInitiatePurchase(packages.find(p => p.id === purchasingId)!)}
                                    disabled={loading}
                                    className="px-6 py-3 bg-brand-gold text-white rounded-xl font-black text-xs uppercase"
                                >
                                    {loading ? "..." : "Pay"}
                                </button>
                            </div>
                            {statusMessage && (
                                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-brand-gold uppercase animate-pulse">
                                    <Loader2 size={12} className="animate-spin" />
                                    {statusMessage}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                        {packages.map((pkg) => (
                            <button
                                key={pkg.id}
                                onClick={() => setPurchasingId(pkg.id === purchasingId ? null : pkg.id)}
                                className={`w-full bg-[#fefcf3] border-2 p-4 rounded-2xl shadow-sm flex items-center justify-between transition-all group ${purchasingId === pkg.id ? 'border-brand-gold ring-1 ring-brand-gold/20' : 'border-black/[0.03] hover:border-brand-gold/30'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:scale-110 transition border border-brand-gold/20">
                                        <div className="relative">
                                            <Coins size={24} />
                                            <span className="absolute -top-1 -right-1 text-[8px] font-black">{pkg.total_tokens}</span>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-black text-brand-dark uppercase tracking-tight">{pkg.name}</div>
                                        <div className="text-[10px] font-bold text-brand-dark/40 uppercase">{pkg.total_tokens} Pesa Tokens</div>
                                    </div>
                                </div>
                                <div className="bg-brand-dark text-white px-3 py-2 rounded-xl text-[10px] font-black">
                                    KES {pkg.price_kes}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ways to Earn */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <Zap className="text-brand-gold" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Other Ways</span>
                    </div>

                    <button
                        onClick={() => { onGoToQuiz?.(); onClose(); }}
                        className="w-full bg-[#fefcf3] border border-black/[0.03] p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:border-brand-gold/30 transition group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition border border-emerald-100">
                            <Award size={24} />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-black text-brand-dark uppercase tracking-tight">Daily Quiz</div>
                            <div className="text-[10px] font-bold text-brand-dark/40 uppercase">Earn up to 120 Tokens daily</div>
                        </div>
                        <ArrowRight size={16} className="text-brand-dark/20 group-hover:translate-x-1 transition" />
                    </button>
                </div>

                {/* Info Box */}
                <div className="bg-[#fbb03b]/10 p-5 rounded-2xl flex gap-4 border border-[#fbb03b]/20 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#fbb03b]/10 flex items-center justify-center text-[#fbb03b] shrink-0">
                        <Info size={20} />
                    </div>
                    <div>
                        <div className="text-[11px] font-black uppercase tracking-tight text-brand-dark">About Tokens</div>
                        <p className="text-[10px] font-bold text-brand-dark/60 leading-relaxed mt-1 uppercase">
                            Tokens are purely for in-game participation. They cannot be withdrawn but help you grow rank.
                        </p>
                    </div>
                </div>
            </div>
        </OverlayModal>
    );
}
