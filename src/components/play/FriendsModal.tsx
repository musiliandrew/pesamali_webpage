"use client";

import { useEffect, useState } from "react";
import OverlayModal from "./OverlayModal";
import { UserPlus, Search, UserCheck, Clock, Gift, Swords, Zap, X } from "lucide-react";
import { del, get, post } from "@/lib/api";

type Friend = {
    id: string;
    displayName: string;
    avatar?: string | null;
    pesaProfile?: number;
    streak?: number;
    online?: boolean;
};

type FriendRequest = {
    id: string;
    fromUserId: string;
    toUserId: string;
    fromDisplayName?: string;
    toDisplayName?: string;
    status?: 'pending' | 'accepted' | 'rejected' | 'canceled';
};

type ChallengeInvite = {
    id: string;
    fromUserId: string;
    toUserId: string;
    fromDisplayName?: string;
    toDisplayName?: string;
    dreamId?: string;
    dreamName?: string;
    dreamCost?: number;
    size: number;
    status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
    matchId?: string;
    createdAt?: string;
    expiresAt?: string;
};

type SearchUser = {
    id: string;
    displayName?: string;
};

export default function FriendsModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [incoming, setIncoming] = useState<FriendRequest[]>([]);
    const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [tab, setTab] = useState<"list" | "requests" | "add" | "challenges">("list");
    const [requestScope, setRequestScope] = useState<"incoming" | "outgoing">("incoming");
    const [challengeScope, setChallengeScope] = useState<"incoming" | "outgoing">("incoming");
    const [challengesIncoming, setChallengesIncoming] = useState<ChallengeInvite[]>([]);
    const [challengesOutgoing, setChallengesOutgoing] = useState<ChallengeInvite[]>([]);

    useEffect(() => {
        if (!open) return;
        fetchFriends();
        fetchRequests();
        fetchOutgoingRequests();
        fetchChallenges();
    }, [open]);

    const fetchFriends = async () => {
        try {
            const data = await get<Friend[]>("/api/friends");
            setFriends(Array.isArray(data) ? data : []);
        } catch { }
    };

    const fetchRequests = async () => {
        try {
            const data = await get<FriendRequest[]>("/api/friends/requests?scope=incoming");
            setIncoming(Array.isArray(data) ? data : []);
        } catch { }
    };

    const fetchOutgoingRequests = async () => {
        try {
            const data = await get<FriendRequest[]>("/api/friends/requests?scope=outgoing");
            setOutgoing(Array.isArray(data) ? data : []);
        } catch { }
    };

    const fetchChallenges = async () => {
        try {
            const [inc, out] = await Promise.all([
                get<ChallengeInvite[]>("/api/friends/challenges?scope=incoming"),
                get<ChallengeInvite[]>("/api/friends/challenges?scope=outgoing"),
            ]);
            setChallengesIncoming(Array.isArray(inc) ? inc : []);
            setChallengesOutgoing(Array.isArray(out) ? out : []);
        } catch { }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const data = await get<SearchUser[]>(`/api/friends/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchResults(Array.isArray(data) ? data : []);
        } catch { } finally {
            setLoading(false);
        }
    };

    const sendRequest = async (id: string) => {
        try {
            await post<FriendRequest>("/api/friends/requests", { toUserId: id });
            alert("Friend request sent!");
            fetchOutgoingRequests();
        } catch { }
    };

    const acceptRequest = async (id: string) => {
        try {
            await post<{ ok: boolean }>(`/api/friends/requests/${id}/accept`, {});
            fetchFriends();
            fetchRequests();
            fetchChallenges();
        } catch { }
    };

    const rejectRequest = async (id: string) => {
        try {
            await post<{ ok: boolean }>(`/api/friends/requests/${id}/reject`, {});
            fetchRequests();
        } catch { }
    };

    const cancelRequest = async (id: string) => {
        try {
            await del<{ ok: boolean }>(`/api/friends/requests/${id}`);
            fetchOutgoingRequests();
        } catch { }
    };

    const unfriend = async (friendId: string) => {
        if (!confirm("Remove this friend?")) return;
        try {
            await del<{ ok: boolean }>(`/api/friends/${friendId}`);
            fetchFriends();
        } catch { }
    };

    const giftPoints = async (friendId: string) => {
        const raw = prompt("Gift how many points?", "50");
        if (!raw) return;
        const amount = parseInt(raw, 10);
        if (!Number.isFinite(amount) || amount <= 0) return;
        try {
            await post<{ ok: boolean; newBalance: number }>(`/api/friends/${friendId}/gift`, { amount });
            alert("Gift sent!");
        } catch { }
    };

    const saveStreak = async (friendId: string) => {
        try {
            await post<{ ok: boolean; newBalance: number }>(`/api/friends/${friendId}/save-streak`, {});
            alert("Streak saved!");
        } catch { }
    };

    const sendChallenge = async (friendId: string) => {
        const sizeRaw = prompt("Challenge size (players)", "2");
        if (!sizeRaw) return;
        const size = parseInt(sizeRaw, 10);
        if (!Number.isFinite(size) || size < 2) return;
        const dreamIdRaw = prompt("Optional dream id", "") || "";
        try {
            await post<{ id: string; status: string }>(`/api/friends/${friendId}/challenge`, {
                dreamId: dreamIdRaw.trim() ? dreamIdRaw.trim() : undefined,
                size,
            });
            alert("Challenge sent!");
            fetchChallenges();
        } catch { }
    };

    const acceptChallenge = async (id: string) => {
        try {
            await post<{ ok: boolean; matchId?: string }>(`/api/friends/challenges/${id}/accept`, {});
            fetchChallenges();
        } catch { }
    };

    const rejectChallenge = async (id: string) => {
        try {
            await post<{ ok: boolean }>(`/api/friends/challenges/${id}/reject`, {});
            fetchChallenges();
        } catch { }
    };

    const cancelChallenge = async (id: string) => {
        try {
            await post<{ ok: boolean }>(`/api/friends/challenges/${id}/cancel`, {});
            fetchChallenges();
        } catch { }
    };

    return (
        <OverlayModal open={open} onClose={onClose} title="Friends & Social" maxWidthClassName="max-w-lg">
            <div className="flex flex-col gap-4">
                {/* Nav Tabs */}
                <div className="flex bg-black/5 p-1 rounded-xl">
                    {([
                        { id: "list", label: "Friends", icon: UserCheck },
                        { id: "requests", label: `Requests ${(incoming.length + outgoing.length) > 0 ? `(${incoming.length + outgoing.length})` : ""}`, icon: Clock },
                        { id: "add", label: "Add", icon: UserPlus },
                        { id: "challenges", label: `Challenges ${(challengesIncoming.length + challengesOutgoing.length) > 0 ? `(${challengesIncoming.length + challengesOutgoing.length})` : ""}`, icon: Swords },
                    ] as Array<{ id: "list" | "requests" | "add" | "challenges"; label: string; icon: typeof UserCheck }>).map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition ${tab === t.id ? "bg-white shadow-sm text-brand-green" : "text-brand-dark/40"
                                }`}
                        >
                            <t.icon size={14} />
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === "list" && (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                        {friends.length === 0 ? (
                            <div className="py-12 text-center text-sm font-bold text-brand-dark/40">
                                You haven&apos;t added any friends yet.
                            </div>
                        ) : (
                            friends.map((f) => (
                                <div key={f.id} className="bg-white border border-black/[0.04] rounded-2xl p-3 flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-brand-green/10 border-2 border-white shadow-sm flex items-center justify-center text-brand-green font-black">
                                            {(f.displayName || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div className={`w-2.5 h-2.5 rounded-full border-2 border-white absolute bottom-0.5 right-0.5 ${f.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[13px] font-black text-brand-dark uppercase tracking-tight">{f.displayName}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9px] font-bold text-brand-dark/40 uppercase">{f.pesaProfile?.toLocaleString() || 0} Pesa</span>
                                            <div className="w-1 h-1 rounded-full bg-black/10" />
                                            <span className="text-[9px] font-bold text-brand-dark/40 uppercase">Streak {f.streak || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => giftPoints(f.id)}
                                            className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-brand-dark/40 hover:bg-brand-gold/10 hover:text-brand-gold transition"
                                        >
                                            <Gift size={14} />
                                        </button>
                                        <button
                                            onClick={() => saveStreak(f.id)}
                                            className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-brand-dark/40 hover:bg-blue-500/10 hover:text-blue-600 transition"
                                        >
                                            <Zap size={14} />
                                        </button>
                                        <button
                                            onClick={() => sendChallenge(f.id)}
                                            className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-brand-dark/40 hover:bg-brand-green/10 hover:text-brand-green transition"
                                        >
                                            <Swords size={14} />
                                        </button>
                                        <button
                                            onClick={() => unfriend(f.id)}
                                            className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-brand-dark/40 hover:bg-red-500/10 hover:text-red-600 transition"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {tab === "requests" && (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                        <div className="flex bg-black/5 p-1 rounded-xl">
                            {([
                                { id: "incoming", label: `Incoming ${incoming.length ? `(${incoming.length})` : ""}` },
                                { id: "outgoing", label: `Outgoing ${outgoing.length ? `(${outgoing.length})` : ""}` },
                            ] as Array<{ id: "incoming" | "outgoing"; label: string }>).map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setRequestScope(t.id)}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition ${requestScope === t.id ? "bg-white shadow-sm text-brand-green" : "text-brand-dark/40"}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {requestScope === "incoming" && (
                            incoming.length === 0 ? (
                                <div className="py-12 text-center text-sm font-bold text-brand-dark/40">
                                    No pending friend requests.
                                </div>
                            ) : (
                                incoming.map((r) => (
                                    <div key={r.id} className="bg-white border border-black/[0.04] rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                                                <UserPlus size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-[12px] font-black text-brand-dark uppercase tracking-tight">{r.fromDisplayName || "Unknown"}</h4>
                                                <p className="text-[9px] font-bold text-brand-dark/40 uppercase">Wants to be your friend</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => rejectRequest(r.id)}
                                                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => acceptRequest(r.id)}
                                                className="px-4 py-2 rounded-xl bg-brand-green text-white text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )
                        )}

                        {requestScope === "outgoing" && (
                            outgoing.length === 0 ? (
                                <div className="py-12 text-center text-sm font-bold text-brand-dark/40">
                                    No outgoing requests.
                                </div>
                            ) : (
                                outgoing.map((r) => (
                                    <div key={r.id} className="bg-white border border-black/[0.04] rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-brand-dark/40">
                                                <Clock size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-[12px] font-black text-brand-dark uppercase tracking-tight">{r.toDisplayName || "Pending"}</h4>
                                                <p className="text-[9px] font-bold text-brand-dark/40 uppercase">Waiting for response</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => cancelRequest(r.id)}
                                                className="px-4 py-2 rounded-xl bg-brand-dark/10 text-brand-dark text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                )}

                {tab === "challenges" && (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                        <div className="flex bg-black/5 p-1 rounded-xl">
                            {([
                                { id: "incoming", label: `Incoming ${challengesIncoming.length ? `(${challengesIncoming.length})` : ""}` },
                                { id: "outgoing", label: `Outgoing ${challengesOutgoing.length ? `(${challengesOutgoing.length})` : ""}` },
                            ] as Array<{ id: "incoming" | "outgoing"; label: string }>).map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setChallengeScope(t.id)}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition ${challengeScope === t.id ? "bg-white shadow-sm text-brand-green" : "text-brand-dark/40"}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {challengeScope === "incoming" && (
                            challengesIncoming.length === 0 ? (
                                <div className="py-12 text-center text-sm font-bold text-brand-dark/40">No incoming challenges.</div>
                            ) : (
                                challengesIncoming.map((c) => (
                                    <div key={c.id} className="bg-white border border-black/[0.04] rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                                                <Swords size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-[12px] font-black text-brand-dark uppercase tracking-tight">{c.fromDisplayName || "Friend"}</h4>
                                                <p className="text-[9px] font-bold text-brand-dark/40 uppercase">Challenge • {c.size} players • {c.dreamName || "Any dream"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => rejectChallenge(c.id)}
                                                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => acceptChallenge(c.id)}
                                                className="px-4 py-2 rounded-xl bg-brand-green text-white text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )
                        )}

                        {challengeScope === "outgoing" && (
                            challengesOutgoing.length === 0 ? (
                                <div className="py-12 text-center text-sm font-bold text-brand-dark/40">No outgoing challenges.</div>
                            ) : (
                                challengesOutgoing.map((c) => (
                                    <div key={c.id} className="bg-white border border-black/[0.04] rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-brand-dark/40">
                                                <Clock size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-[12px] font-black text-brand-dark uppercase tracking-tight">{c.toDisplayName || "Friend"}</h4>
                                                <p className="text-[9px] font-bold text-brand-dark/40 uppercase">Pending • {c.size} players • {c.dreamName || "Any dream"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => cancelChallenge(c.id)}
                                                className="px-4 py-2 rounded-xl bg-brand-dark/10 text-brand-dark text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                )}

                {tab === "add" && (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Search players by name..."
                                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white border-2 border-[rgba(139,115,85,0.15)] outline-none focus:border-brand-gold transition-colors font-bold text-sm"
                            />
                        </div>

                        <div className="space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar">
                            {loading ? (
                                <div className="py-8 text-center animate-pulse font-black text-brand-dark/20 uppercase tracking-widest text-xs">Searching database...</div>
                            ) : searchResults.length === 0 && searchQuery ? (
                                <div className="py-8 text-center text-sm font-bold text-brand-dark/40">No players found matching &quot;{searchQuery}&quot;</div>
                            ) : (
                                searchResults.map((u) => (
                                    <div key={u.id} className="bg-white border border-black/[0.04] rounded-2xl p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-black text-brand-dark/30 text-xs uppercase">
                                                {(u.displayName || "?").charAt(0)}
                                            </div>
                                            <div className="text-sm font-black text-brand-dark uppercase tracking-tight">{u.displayName}</div>
                                        </div>
                                        <button
                                            onClick={() => sendRequest(u.id)}
                                            className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center hover:bg-brand-gold hover:text-white transition"
                                        >
                                            <UserPlus size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </OverlayModal>
    );
}
