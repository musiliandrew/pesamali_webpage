"use client";

import { useEffect, useState, useMemo } from "react";
import OverlayModal from "./OverlayModal";
import { Users, Plus, Shield, ArrowRight, TrendingUp, Info, ChevronLeft, Target, Coins, Gift } from "lucide-react";
import { getApiBaseUrl } from "@/lib/env";
import { getToken } from "@/lib/auth";

type Society = {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    isPublic: boolean;
    memberCount: number;
    maxMembers: number;
    myRole?: "owner" | "admin" | "member" | null;
};

type SocietyGoal = {
    id: string;
    description: string;
    targetAmount: number;
    status: string;
};

type SocietyMember = {
    id: string;
    displayName: string;
    role: string;
    pesaProfile: number;
};

type FullSociety = Society & {
    bankBalance: number;
    goals: SocietyGoal[];
    members: SocietyMember[];
};

export default function SocietiesModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [societies, setSocieties] = useState<Society[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detailedSoc, setDetailedSoc] = useState<FullSociety | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<"browse" | "my">("browse");
    const [contribAmount, setContribAmount] = useState<string>("100");

    const apiBase = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!open) return;
        fetchSocieties();
    }, [open, apiBase]);

    useEffect(() => {
        if (selectedId) fetchDetailedSociety(selectedId);
        else setDetailedSoc(null);
    }, [selectedId]);

    const fetchSocieties = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            const res = await fetch(`${apiBase}/api/societies`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load societies");
            setSocieties(await res.json());
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    };

    const fetchDetailedSociety = async (id: string) => {
        setLoading(true);
        try {
            const token = getToken();
            const [sRes, mRes] = await Promise.all([
                fetch(`${apiBase}/api/societies/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${apiBase}/api/societies/${id}/members`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (!sRes.ok) throw new Error("Society detail failed");
            const sData = await sRes.json();
            const mData = await mRes.json();
            setDetailedSoc({ ...sData, members: mData });
        } catch (e) {
            alert(String(e));
            setSelectedId(null);
        } finally {
            setLoading(false);
        }
    };

    const handleContribute = async () => {
        if (!selectedId || !contribAmount) return;
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/societies/${selectedId}/contribute`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ amount: parseInt(contribAmount) }),
            });
            if (!res.ok) throw new Error(await res.text());
            alert("Contribution successful!");
            fetchDetailedSociety(selectedId);
        } catch (e) {
            alert(String(e));
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (id: string) => {
        try {
            const res = await fetch(`${apiBase}/api/societies/${id}/join`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(await res.text());
            fetchSocieties();
        } catch (e) {
            alert(String(e));
        }
    };

    const handleBookBulk = async (amount: number) => {
        if (!selectedId) return;
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/societies/${selectedId}/bulk-booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ token_amount: amount }),
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            alert(`Booking created! ID: ${data.bookingId}. Total price: ${data.totalPrice} bob. Once paid, verify and distribute.`);
            // In a real app, we'd show the payment UI here
            handleVerifyBulk(data.bookingId);
        } catch (e) {
            alert(String(e));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyBulk = async (bookingId: string) => {
        if (!selectedId) return;
        try {
            const res = await fetch(`${apiBase}/api/societies/${selectedId}/bulk-verify/${bookingId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            alert(`Payment verified! Status: ${data.status}. Now distributing to ${detailedSoc?.memberCount} members...`);
            handleDistributeBulk(bookingId);
        } catch (e) {
            alert(String(e));
        }
    };

    const handleDistributeBulk = async (bookingId: string) => {
        if (!selectedId) return;
        try {
            const res = await fetch(`${apiBase}/api/societies/${selectedId}/bulk-distribute/${bookingId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            alert(`Distribution complete! Each member received ${data.tokensPerMember} tokens. Total distributed: ${data.totalDistributed}.`);
            fetchDetailedSociety(selectedId);
        } catch (e) {
            alert(String(e));
        }
    };

    const filteredSocieties = societies.filter((s) =>
        tab === "my" ? s.myRole : !s.myRole
    );

    return (
        <OverlayModal
            open={open}
            onClose={() => { setSelectedId(null); onClose(); }}
            title={selectedId && detailedSoc ? detailedSoc.name : "Societies"}
            maxWidthClassName="max-w-lg"
        >
            <div className="flex flex-col gap-4">
                {selectedId && detailedSoc ? (
                    <div className="flex flex-col gap-6">
                        <button
                            onClick={() => setSelectedId(null)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-dark/40 hover:text-brand-green transition"
                        >
                            <ChevronLeft size={14} /> Back to Societies
                        </button>

                        <div className="flex items-center gap-5">
                            <div
                                className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg border-4 border-white"
                                style={{ backgroundColor: detailedSoc.color || "#2D5016", color: "#fff" }}
                            >
                                {detailedSoc.icon || "🎯"}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-black text-brand-dark uppercase tracking-tight">{detailedSoc.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="px-2 py-0.5 rounded-lg bg-brand-gold/10 text-brand-gold text-[9px] font-black uppercase">
                                        Rank #{detailedSoc.id.slice(0, 2)}
                                    </div>
                                    <div className="text-[10px] font-bold text-brand-dark/40 uppercase">
                                        {detailedSoc.memberCount} Members
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-brand-green/5 p-4 rounded-2xl border border-brand-green/10">
                                <div className="text-[9px] font-black uppercase tracking-widest text-brand-green/60 mb-1">Bank Balance</div>
                                <div className="text-lg font-black text-brand-green">{detailedSoc.bankBalance?.toLocaleString() || 0}</div>
                            </div>
                            <div className="bg-brand-gold/5 p-4 rounded-2xl border border-brand-gold/10">
                                <div className="text-[9px] font-black uppercase tracking-widest text-brand-gold/60 mb-1">My Role</div>
                                <div className="text-lg font-black text-brand-gold uppercase">{detailedSoc.myRole || "Guest"}</div>
                            </div>
                        </div>

                        {detailedSoc.myRole && (
                            <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-black/[0.03] shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Coins className="text-brand-gold" size={18} />
                                    <span className="text-[11px] font-black uppercase tracking-wider">Contribute Pesa</span>
                                </div>
                                <div className="flex flex-col xs:flex-row gap-2">
                                    <input
                                        type="number"
                                        value={contribAmount}
                                        onChange={(e) => setContribAmount(e.target.value)}
                                        className="w-full xs:flex-1 bg-black/5 rounded-xl px-4 py-3 font-black text-sm outline-none focus:ring-2 ring-brand-gold/30 min-w-0"
                                        placeholder="Amount..."
                                    />
                                    <button
                                        onClick={handleContribute}
                                        disabled={loading}
                                        className="w-full xs:w-auto bg-brand-gold text-white px-8 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-brand-gold/20 active:scale-95 transition disabled:opacity-50 whitespace-nowrap"
                                    >
                                        Donate
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* BULK ECONOMY (Teacher Model) */}
                        {detailedSoc.myRole && (detailedSoc.myRole === 'owner' || detailedSoc.myRole === 'admin') && detailedSoc.memberCount > 20 && (
                            <div className="bg-brand-primary/5 p-5 rounded-[32px] border-2 border-brand-primary/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                                            <Gift className="text-brand-primary" size={16} />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-wider text-brand-primary">Bulk Token Economy</span>
                                    </div>
                                    <div className="px-2 py-0.5 rounded-lg bg-brand-primary text-white text-[8px] font-black uppercase">
                                        Enabled
                                    </div>
                                </div>

                                <p className="text-[10px] font-bold text-brand-primary/60 mb-4 leading-relaxed uppercase tracking-tight">
                                    Society Discount Unlocked! Buy tokens at 10 bob (instead of 15) and distribute equally to all {detailedSoc.memberCount} members.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            id="bulkAmount"
                                            className="flex-1 bg-white border-2 border-brand-primary/10 rounded-2xl px-4 py-3 font-black text-sm outline-none focus:border-brand-primary/40"
                                            placeholder="Tokens to book..."
                                        />
                                        <button
                                            onClick={() => {
                                                const amt = (document.getElementById('bulkAmount') as HTMLInputElement)?.value;
                                                if (amt) handleBookBulk(parseInt(amt));
                                            }}
                                            className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-brand-primary/20"
                                        >
                                            Book
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between bg-white/50 p-3 rounded-2xl border border-dashed border-brand-primary/20">
                                        <div className="text-[9px] font-black text-brand-primary/40 uppercase">Economic Model</div>
                                        <div className="text-[10px] font-black text-brand-primary uppercase">1 Token = 10 Bob</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <Target className="text-brand-red" size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Active Goals</span>
                            </div>
                            {detailedSoc.goals?.length === 0 ? (
                                <div className="text-center py-4 text-[10px] font-bold text-brand-dark/30 italic">No active goals found</div>
                            ) : (
                                detailedSoc.goals?.map(g => (
                                    <div key={g.id} className="bg-white border border-black/[0.04] p-4 rounded-2xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs font-black text-brand-dark uppercase tracking-tight">{g.description}</div>
                                            <div className="text-[10px] font-black text-brand-green">{g.targetAmount?.toLocaleString()} Pesa</div>
                                        </div>
                                        <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-brand-green transition-all"
                                                style={{ width: `${Math.min(100, (detailedSoc.bankBalance / g.targetAmount) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex bg-black/5 p-1 rounded-xl">
                            <button
                                onClick={() => setTab("browse")}
                                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition ${tab === "browse" ? "bg-white shadow-sm text-brand-green" : "text-brand-dark/40"
                                    }`}
                            >
                                Browse
                            </button>
                            <button
                                onClick={() => setTab("my")}
                                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition ${tab === "my" ? "bg-white shadow-sm text-brand-green" : "text-brand-dark/40"
                                    }`}
                            >
                                My Societies
                            </button>
                        </div>

                        {loading ? (
                            <div className="py-10 text-center text-brand-dark/40 animate-pulse font-bold">
                                Loading societies...
                            </div>
                        ) : error ? (
                            <div className="py-6 px-4 text-center">
                                <div className="text-brand-red text-sm font-bold bg-brand-red/5 p-4 rounded-xl border border-brand-red/20 mb-4">
                                    {error}
                                </div>
                                <button
                                    onClick={fetchSocieties}
                                    className="px-6 py-2 bg-brand-gold text-white rounded-xl font-black text-xs uppercase tracking-widest"
                                >
                                    Retry Connection
                                </button>
                            </div>
                        ) : filteredSocieties.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                                    <Users size={32} />
                                </div>
                                <div className="text-sm font-black text-brand-dark/40 uppercase tracking-tight">
                                    {tab === "my" ? "You haven't joined any societies yet" : "No new societies available"}
                                </div>
                                {tab === "browse" && societies.length > 0 && (
                                    <p className="text-[10px] font-bold text-brand-dark/20 mt-2 uppercase">
                                        (You are already a member of all active societies)
                                    </p>
                                )}
                                <button
                                    onClick={fetchSocieties}
                                    className="mt-4 text-[10px] font-black underline text-brand-green uppercase tracking-widest"
                                >
                                    Refresh List
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
                                {filteredSocieties.map((s) => (
                                    <div
                                        key={s.id}
                                        onClick={() => s.myRole && setSelectedId(s.id)}
                                        className={`bg-white border-2 border-black/[0.03] rounded-2xl p-4 shadow-sm transition-all group ${s.myRole ? 'cursor-pointer hover:border-brand-green/30' : 'hover:border-brand-gold/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0"
                                                style={{ backgroundColor: s.color || "#2D5016", color: "#fff" }}
                                            >
                                                {s.icon || "🎯"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-black text-brand-dark truncate leading-tight uppercase text-sm tracking-tight">{s.name}</h3>
                                                    {s.myRole === 'owner' && <Shield size={12} className="text-brand-gold" />}
                                                </div>
                                                <p className="text-[11px] font-bold text-brand-dark/50 line-clamp-1 mt-0.5">
                                                    {s.description || "No description provided"}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex items-center gap-1">
                                                        <Users size={12} className="text-brand-green" />
                                                        <span className="text-[10px] font-black text-brand-green">{s.memberCount}/{s.maxMembers}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp size={12} className="text-blue-500" />
                                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Active</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {s.myRole ? (
                                                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-brand-dark/40 group-hover:bg-brand-green/10 group-hover:text-brand-green transition">
                                                    <ArrowRight size={18} />
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleJoin(s.id); }}
                                                    className="h-10 px-4 rounded-xl bg-brand-green text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-green/20 hover:scale-[1.02] active:scale-95 transition"
                                                >
                                                    Join
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className="mt-2 w-full py-4 rounded-2xl bg-white border-2 border-dashed border-black/10 text-brand-dark/40 hover:border-brand-gold/40 hover:text-brand-gold transition-all group flex items-center justify-center gap-2"
                            onClick={() => alert("Creation coming soon")}
                        >
                            <div className="w-6 h-6 rounded-lg bg-black/5 flex items-center justify-center group-hover:bg-brand-gold/10">
                                <Plus size={16} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest">Create New Society</span>
                        </button>
                    </div>
                )}
            </div>
        </OverlayModal>
    );
}
