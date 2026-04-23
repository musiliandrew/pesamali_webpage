"use client";

import { useEffect, useState } from "react";
import OverlayModal from "./OverlayModal";
import { Users, Plus, Shield, ArrowRight, TrendingUp, ChevronLeft, Target, Coins, Gift, Trophy, X } from "lucide-react";
import { del, get, post } from "@/lib/api";

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

type SocietyJoinRequest = {
    id: string;
    userId?: string;
    userName?: string;
    displayName?: string;
    createdAt?: string;
};

type SocietyLeaderboardEntry = {
    id: string;
    name: string;
    icon?: string;
    color?: string;
    memberCount?: number;
    bankBalance?: number;
    rank?: number;
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
    const [tab, setTab] = useState<"browse" | "my" | "leaderboard">("browse");
    const [contribAmount, setContribAmount] = useState<string>("100");

    const [pendingRequests, setPendingRequests] = useState<SocietyJoinRequest[]>([]);
    const [goalDesc, setGoalDesc] = useState("");
    const [goalTarget, setGoalTarget] = useState("1000");

    const [showCreate, setShowCreate] = useState(false);
    const [createName, setCreateName] = useState("");
    const [createDesc, setCreateDesc] = useState("");
    const [createPublic, setCreatePublic] = useState(true);
    const [createColor, setCreateColor] = useState("#2D5016");
    const [createIcon, setCreateIcon] = useState("🎯");

    const [leaderboard, setLeaderboard] = useState<SocietyLeaderboardEntry[]>([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

    useEffect(() => {
        if (!open) return;
        fetchSocieties();
    }, [open]);

    useEffect(() => {
        if (!open) return;
        if (tab !== "leaderboard") return;
        fetchLeaderboard();
    }, [open, tab]);

    useEffect(() => {
        if (selectedId) {
            fetchDetailedSociety(selectedId);
            fetchPendingRequests(selectedId);
        } else {
            setDetailedSoc(null);
            setPendingRequests([]);
        }
    }, [selectedId]);

    const fetchSocieties = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await get<Society[]>("/api/societies");
            setSocieties(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    };

    const fetchDetailedSociety = async (id: string) => {
        setLoading(true);
        try {
            const [sData, mData] = await Promise.all([
                get<Omit<FullSociety, "members"> & { members?: never }>(`/api/societies/${id}`),
                get<SocietyMember[]>(`/api/societies/${id}/members`),
            ]);
            setDetailedSoc({ ...(sData as unknown as Omit<FullSociety, "members">), members: Array.isArray(mData) ? mData : [] });
        } catch (e) {
            alert(String(e));
            setSelectedId(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingRequests = async (id: string) => {
        try {
            const data = await get<SocietyJoinRequest[]>(`/api/societies/${id}/requests`);
            setPendingRequests(Array.isArray(data) ? data : []);
        } catch {
            setPendingRequests([]);
        }
    };

    const fetchLeaderboard = async () => {
        setLoadingLeaderboard(true);
        try {
            const data = await get<SocietyLeaderboardEntry[]>("/api/societies/leaderboard");
            setLeaderboard(Array.isArray(data) ? data : []);
        } catch {
            setLeaderboard([]);
        } finally {
            setLoadingLeaderboard(false);
        }
    };

    const handleContribute = async () => {
        if (!selectedId || !contribAmount) return;
        setLoading(true);
        try {
            await post(`/api/societies/${selectedId}/contribute`, { amount: parseInt(contribAmount) });
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
            await post(`/api/societies/${id}/join`);
            fetchSocieties();
        } catch (e) {
            alert(String(e));
        }
    };

    const handleLeave = async (id: string) => {
        if (!confirm("Leave this society?")) return;
        setLoading(true);
        try {
            await del(`/api/societies/${id}/leave`);
            setSelectedId(null);
            fetchSocieties();
        } catch (e) {
            alert(String(e));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSociety = async (id: string) => {
        if (!confirm("Delete this society?")) return;
        setLoading(true);
        try {
            await del(`/api/societies/${id}`);
            setSelectedId(null);
            fetchSocieties();
        } catch (e) {
            alert(String(e));
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId: string) => {
        if (!selectedId) return;
        try {
            await post(`/api/societies/${selectedId}/requests/${requestId}/approve`, {});
            fetchPendingRequests(selectedId);
            fetchDetailedSociety(selectedId);
        } catch (e) {
            alert(String(e));
        }
    };

    const handleDeny = async (requestId: string) => {
        if (!selectedId) return;
        try {
            await post(`/api/societies/${selectedId}/requests/${requestId}/deny`, {});
            fetchPendingRequests(selectedId);
        } catch (e) {
            alert(String(e));
        }
    };

    const handleCreateGoal = async () => {
        if (!selectedId) return;
        const target = parseInt(goalTarget, 10);
        if (!goalDesc.trim() || !Number.isFinite(target) || target <= 0) return;
        setLoading(true);
        try {
            await post(`/api/societies/${selectedId}/goals`, {
                description: goalDesc.trim(),
                target_amount: target,
            });
            setGoalDesc("");
            fetchDetailedSociety(selectedId);
        } catch (e) {
            alert(String(e));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSociety = async () => {
        if (!createName.trim()) return;
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("name", createName.trim());
            if (createDesc.trim()) params.set("description", createDesc.trim());
            params.set("is_public", String(createPublic));
            if (createColor.trim()) params.set("color", createColor.trim());
            if (createIcon.trim()) params.set("icon", createIcon.trim());
            await post(`/api/societies?${params.toString()}`);
            setShowCreate(false);
            setCreateName("");
            setCreateDesc("");
            fetchSocieties();
        } catch (e) {
            alert(String(e));
        } finally {
            setLoading(false);
        }
    };

    const handleBookBulk = async (amount: number) => {
        if (!selectedId) return;
        setLoading(true);
        try {
            const data = await post<{ bookingId: string; totalPrice: number }>(`/api/societies/${selectedId}/bulk-booking`, { token_amount: amount });
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
            const data = await post<{ status: string }>(`/api/societies/${selectedId}/bulk-verify/${bookingId}`, {});
            alert(`Payment verified! Status: ${data.status}. Now distributing to ${detailedSoc?.memberCount} members...`);
            handleDistributeBulk(bookingId);
        } catch (e) {
            alert(String(e));
        }
    };

    const handleDistributeBulk = async (bookingId: string) => {
        if (!selectedId) return;
        try {
            const data = await post<{ tokensPerMember: number; totalDistributed: number }>(`/api/societies/${selectedId}/bulk-distribute/${bookingId}`, {});
            alert(`Distribution complete! Each member received ${data.tokensPerMember} tokens. Total distributed: ${data.totalDistributed}.`);
            fetchDetailedSociety(selectedId);
        } catch (e) {
            alert(String(e));
        }
    };

    const filteredSocieties = societies.filter((s) =>
        tab === "my" ? s.myRole : !s.myRole
    );

    const canModerate = detailedSoc?.myRole === "owner" || detailedSoc?.myRole === "admin";

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

                        {detailedSoc.myRole && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleLeave(detailedSoc.id)}
                                    disabled={loading}
                                    className="flex-1 h-12 rounded-2xl bg-brand-dark/10 text-brand-dark font-black uppercase text-[10px] tracking-widest hover:bg-brand-dark hover:text-white transition disabled:opacity-50"
                                >
                                    Leave
                                </button>
                                {detailedSoc.myRole === "owner" && (
                                    <button
                                        onClick={() => handleDeleteSociety(detailedSoc.id)}
                                        disabled={loading}
                                        className="h-12 px-5 rounded-2xl bg-red-500/10 text-red-600 font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
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

                        {canModerate && (
                            <div className="bg-white p-4 rounded-3xl border-2 border-black/[0.03] shadow-sm space-y-3">
                                <div className="flex items-center gap-2">
                                    <Target className="text-brand-green" size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Create Goal</span>
                                </div>
                                <input
                                    value={goalDesc}
                                    onChange={(e) => setGoalDesc(e.target.value)}
                                    placeholder="Goal description"
                                    className="w-full bg-black/5 rounded-2xl px-4 py-3 font-black text-[11px] uppercase tracking-wider outline-none"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={goalTarget}
                                        onChange={(e) => setGoalTarget(e.target.value)}
                                        className="flex-1 bg-black/5 rounded-2xl px-4 py-3 font-black text-sm outline-none"
                                    />
                                    <button
                                        onClick={handleCreateGoal}
                                        disabled={loading}
                                        className="px-6 py-3 rounded-2xl bg-brand-green text-white font-black uppercase text-[10px] tracking-widest disabled:opacity-50"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}

                        {canModerate && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2">
                                        <Shield className="text-brand-gold" size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Join Requests</span>
                                    </div>
                                    <div className="text-[10px] font-black text-brand-dark/30">{pendingRequests.length}</div>
                                </div>
                                {pendingRequests.length === 0 ? (
                                    <div className="text-center py-4 text-[10px] font-bold text-brand-dark/30 italic">No pending requests</div>
                                ) : (
                                    <div className="space-y-2">
                                        {pendingRequests.map((r) => (
                                            <div key={r.id} className="bg-white border border-black/[0.04] p-3 rounded-2xl flex items-center justify-between">
                                                <div className="min-w-0">
                                                    <div className="text-[11px] font-black uppercase text-brand-dark truncate">{r.displayName || r.userName || "Member"}</div>
                                                    <div className="text-[9px] font-bold text-brand-dark/30 uppercase">Pending approval</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDeny(r.id)}
                                                        className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(r.id)}
                                                        className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition"
                                                    >
                                                        <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex bg-black/5 p-1 rounded-xl">
                            <button
                                onClick={() => setTab("browse")}
                                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition ${tab === "browse" ? "bg-white shadow-sm text-brand-green" : "text-brand-dark/40"}`}
                            >
                                Browse
                            </button>
                            <button
                                onClick={() => setTab("my")}
                                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition ${tab === "my" ? "bg-white shadow-sm text-brand-green" : "text-brand-dark/40"}`}
                            >
                                My Societies
                            </button>
                            <button
                                onClick={() => setTab("leaderboard")}
                                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition ${tab === "leaderboard" ? "bg-white shadow-sm text-brand-green" : "text-brand-dark/40"}`}
                            >
                                Leaderboard
                            </button>
                        </div>

                        {tab === "leaderboard" && (
                            <div className="space-y-3">
                                {loadingLeaderboard ? (
                                    <div className="py-10 text-center text-brand-dark/40 animate-pulse font-bold">Loading leaderboard...</div>
                                ) : leaderboard.length === 0 ? (
                                    <div className="py-10 text-center text-brand-dark/40 font-bold">No rankings available.</div>
                                ) : (
                                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
                                        {leaderboard.map((s, idx) => (
                                            <div key={s.id} className="bg-white border border-black/[0.04] rounded-2xl p-4 flex items-center gap-4">
                                                <div className="w-10 text-center font-black text-brand-dark/30">#{s.rank ?? (idx + 1)}</div>
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0"
                                                    style={{ backgroundColor: s.color || "#2D5016", color: "#fff" }}
                                                >
                                                    {s.icon || "🎯"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-black text-brand-dark uppercase tracking-tight truncate">{s.name}</div>
                                                    <div className="text-[10px] font-bold text-brand-dark/40 uppercase">{s.memberCount ?? 0} members</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-black text-brand-green">{(s.bankBalance ?? 0).toLocaleString()}</div>
                                                    <div className="text-[9px] font-bold text-brand-dark/30 uppercase">Bank</div>
                                                </div>
                                                <Trophy size={18} className="text-brand-gold" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {tab !== "leaderboard" && (
                            <>
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
                                                className={`bg-white border-2 border-black/[0.03] rounded-2xl p-4 shadow-sm transition-all group ${s.myRole ? "cursor-pointer hover:border-brand-green/30" : "hover:border-brand-gold/30"}`}
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
                                                            {s.myRole === "owner" && <Shield size={12} className="text-brand-gold" />}
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
                                    onClick={() => setShowCreate(true)}
                                >
                                    <div className="w-6 h-6 rounded-lg bg-black/5 flex items-center justify-center group-hover:bg-brand-gold/10">
                                        <Plus size={16} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Create New Society</span>
                                </button>

                                {showCreate && (
                                    <div className="bg-white border-2 border-brand-gold/20 rounded-3xl p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[11px] font-black uppercase tracking-widest text-brand-dark/40">Create Society</div>
                                            <button onClick={() => setShowCreate(false)} className="text-brand-dark/30 hover:text-brand-dark transition">
                                                <X size={18} />
                                            </button>
                                        </div>
                                        <input
                                            value={createName}
                                            onChange={(e) => setCreateName(e.target.value)}
                                            placeholder="Society name"
                                            className="w-full bg-black/5 rounded-2xl px-4 py-3 font-black text-[11px] uppercase tracking-wider outline-none"
                                        />
                                        <input
                                            value={createDesc}
                                            onChange={(e) => setCreateDesc(e.target.value)}
                                            placeholder="Description (optional)"
                                            className="w-full bg-black/5 rounded-2xl px-4 py-3 font-bold text-[11px] uppercase tracking-wider outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                value={createIcon}
                                                onChange={(e) => setCreateIcon(e.target.value)}
                                                placeholder="Icon"
                                                className="w-24 bg-black/5 rounded-2xl px-4 py-3 font-black text-sm outline-none"
                                            />
                                            <input
                                                value={createColor}
                                                onChange={(e) => setCreateColor(e.target.value)}
                                                placeholder="#2D5016"
                                                className="flex-1 bg-black/5 rounded-2xl px-4 py-3 font-black text-sm outline-none"
                                            />
                                            <button
                                                onClick={() => setCreatePublic((v) => !v)}
                                                className={`px-4 rounded-2xl font-black uppercase text-[10px] tracking-widest ${createPublic ? "bg-brand-green text-white" : "bg-black/10 text-brand-dark"}`}
                                            >
                                                {createPublic ? "Public" : "Private"}
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleCreateSociety}
                                            disabled={loading}
                                            className="w-full h-12 rounded-2xl bg-brand-gold text-white font-black uppercase text-[10px] tracking-widest disabled:opacity-50"
                                        >
                                            Create
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </OverlayModal>
    );
}
