"use client";

import { useEffect, useState } from "react";
import { Info, Zap, Award, Coins, Loader2, ArrowRight, Clock } from "lucide-react";
import OverlayModal from "./OverlayModal";
import { get, post } from "@/lib/api";

type TokenPackage = {
    id: string;
    name: string;
    description: string;
    price_kes: number;
    total_tokens: number;
};

type TokenBalance = {
    pesa_tokens: number;
    next_token_at?: string | null;
};

type TokenTransaction = {
    id: string;
    transaction_type: string;
    amount: number;
    balance_after: number;
    notes?: string;
    created_at: string;
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
    const [purchasingId, setPurchasingId] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const [tab, setTab] = useState<"shop" | "history">("shop");
    const [balanceTokens, setBalanceTokens] = useState<number | null>(null);
    const [nextTokenAt, setNextTokenAt] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (!open) return;
        fetchPackages();
        loadBalance();
    }, [open]);

    useEffect(() => {
        if (!open) return;
        if (tab !== "history") return;
        loadHistory();
    }, [open, tab]);

    const fetchPackages = async () => {
        try {
            const data = await get<TokenPackage[]>("/api/tokens/packages");
            setPackages(Array.isArray(data) ? data : []);
        } catch { }
    };

    const loadBalance = async () => {
        try {
            const data = await get<TokenBalance>("/api/tokens/balance");
            if (typeof data?.pesa_tokens === "number") setBalanceTokens(data.pesa_tokens);
            setNextTokenAt(data?.next_token_at ?? null);
        } catch {
            setBalanceTokens(null);
            setNextTokenAt(null);
        }
    };

    const loadHistory = async () => {
        setLoadingHistory(true);
        try {
            const data = await get<TokenTransaction[]>("/api/tokens/transactions");
            setTransactions(Array.isArray(data) ? data : []);
        } catch {
            setTransactions([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleClaimDaily = async () => {
        setClaiming(true);
        try {
            const data = await post<{ success?: boolean; message?: string }>("/api/tokens/claim-daily", {});
            alert(data.message);
            if (data.success) {
                onRefresh?.();
                loadBalance();
            }
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
            const data = await post<{ success?: boolean; reference?: string; message?: string }>(
                "/api/tokens/purchase/initiate",
                {
                    package_id: pkg.id,
                    phone_number: phoneNumber,
                },
            );
            if (data.success) {
                setPurchasingId(pkg.id);
                setStatusMessage("Waiting for STK Push confirmation...");
                // Start polling
                if (data.reference) pollStatus(data.reference);
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
                const data = await get<{ status?: string }>(`/api/tokens/purchase/status/${ref}`);
                if (data.status === "success") {
                    clearInterval(interval);
                    setStatusMessage("Success! Tokens credited.");
                    onRefresh?.();
                    loadBalance();
                    loadHistory();
                    setTimeout(() => {
                        setPurchasingId(null);
                        setStatusMessage(null);
                    }, 3000);
                } else if (data.status === "error") {
                    clearInterval(interval);
                    setStatusMessage("Payment failed. Please try again.");
                    setTimeout(() => setStatusMessage(null), 3000);
                }
            } catch { }
        }, 3000);
        setTimeout(() => clearInterval(interval), 60000); // 1 minute timeout
    };

    return (
        <OverlayModal open={open} onClose={onClose} title="Pesa Tokens" maxWidthClassName="max-w-md">
            <div className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto no-scrollbar pr-1">
                <div className="flex bg-black/5 p-1 rounded-xl">
                    <button
                        onClick={() => setTab("shop")}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition ${tab === "shop" ? "bg-white shadow-sm text-brand-green" : "text-brand-dark/40"}`}
                    >
                        Shop
                    </button>
                    <button
                        onClick={() => setTab("history")}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition ${tab === "history" ? "bg-white shadow-sm text-brand-green" : "text-brand-dark/40"}`}
                    >
                        History
                    </button>
                </div>

                {/* Balance Display */}
                <div className="bg-gradient-to-br from-[#10b981] to-[#0a1f1a] p-6 rounded-[32px] text-white shadow-xl shadow-emerald-500/20 text-center border border-white/10 shrink-0">
                    <div className="text-[11px] font-black uppercase tracking-[3px] opacity-70 mb-2">Your Balance</div>
                    <div className="text-5xl font-black mb-1 flex items-center justify-center gap-3">
                        <span className="text-3xl filter drop-shadow-lg">💎</span> {typeof balanceTokens === "number" ? balanceTokens : tokens}
                    </div>
                    {nextTokenAt && (
                        <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-white/70 flex items-center justify-center gap-2">
                            <Clock size={12} /> Next token: {new Date(nextTokenAt).toLocaleString()}
                        </div>
                    )}
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

                {tab === "shop" && (
                    <>
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
                    </>
                )}

                {tab === "history" && (
                    <div className="space-y-3">
                        {loadingHistory ? (
                            <div className="py-10 text-center text-brand-dark/40 animate-pulse font-bold">Loading history...</div>
                        ) : transactions.length === 0 ? (
                            <div className="py-10 text-center text-brand-dark/40 font-bold">No transactions yet.</div>
                        ) : (
                            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1 no-scrollbar">
                                {transactions.map((t) => (
                                    <div key={t.id} className="bg-white border border-black/[0.04] rounded-2xl p-4 flex items-center justify-between">
                                        <div className="min-w-0">
                                            <div className="text-[11px] font-black uppercase text-brand-dark truncate">{t.transaction_type}</div>
                                            <div className="text-[9px] font-bold text-brand-dark/30 uppercase">{new Date(t.created_at).toLocaleString()}</div>
                                            {t.notes && <div className="text-[9px] font-bold text-brand-dark/20 uppercase truncate">{t.notes}</div>}
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm font-black ${t.amount >= 0 ? "text-emerald-600" : "text-red-600"}`}>{t.amount >= 0 ? `+${t.amount}` : t.amount}</div>
                                            <div className="text-[9px] font-bold text-brand-dark/30 uppercase">Bal {t.balance_after}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </OverlayModal>
    );
}
