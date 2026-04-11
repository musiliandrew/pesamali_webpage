"use client";

import { useEffect, useState, useMemo } from "react";
import OverlayModal from "./OverlayModal";
import { UserPlus, Search, UserCheck, Clock, X, MessageCircle, Gift, Swords, Zap } from "lucide-react";
import { getApiBaseUrl } from "@/lib/env";
import { getToken } from "@/lib/auth";

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
    fromDisplayName: string;
    fromUserId: string;
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
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [tab, setTab] = useState<"list" | "requests" | "add">("list");

    const apiBase = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!open) return;
        fetchFriends();
        fetchRequests();
    }, [open]);

    const fetchFriends = async () => {
        try {
            const res = await fetch(`${apiBase}/api/friends`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) setFriends(await res.json());
        } catch { }
    };

    const fetchRequests = async () => {
        try {
            const res = await fetch(`${apiBase}/api/friends/requests?scope=incoming`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) setIncoming(await res.json());
        } catch { }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/friends/search?q=${encodeURIComponent(searchQuery)}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) setSearchResults(await res.json());
        } catch { } finally {
            setLoading(false);
        }
    };

    const sendRequest = async (id: string) => {
        try {
            await fetch(`${apiBase}/api/friends/requests`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ toUserId: id }),
            });
            alert("Friend request sent!");
        } catch { }
    };

    const acceptRequest = async (id: string) => {
        try {
            await fetch(`${apiBase}/api/friends/requests/${id}/accept`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            fetchFriends();
            fetchRequests();
        } catch { }
    };

    return (
        <OverlayModal open={open} onClose={onClose} title="Friends & Social" maxWidthClassName="max-w-lg">
            <div className="flex flex-col gap-4">
                {/* Nav Tabs */}
                <div className="flex bg-black/5 p-1 rounded-xl">
                    {[
                        { id: "list", label: "Friends", icon: UserCheck },
                        { id: "requests", label: `Requests ${incoming.length > 0 ? `(${incoming.length})` : ""}`, icon: Clock },
                        { id: "add", label: "Add", icon: UserPlus },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id as any)}
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
                                        <button className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-brand-dark/40 hover:bg-brand-gold/10 hover:text-brand-gold transition">
                                            <Gift size={14} />
                                        </button>
                                        <button className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-brand-dark/40 hover:bg-brand-green/10 hover:text-brand-green transition">
                                            <Zap size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {tab === "requests" && (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                        {incoming.length === 0 ? (
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
                                            <h4 className="text-[12px] font-black text-brand-dark uppercase tracking-tight">{r.fromDisplayName}</h4>
                                            <p className="text-[9px] font-bold text-brand-dark/40 uppercase">Wants to be your friend</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => acceptRequest(r.id)}
                                            className="px-4 py-2 rounded-xl bg-brand-green text-white text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            ))
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
