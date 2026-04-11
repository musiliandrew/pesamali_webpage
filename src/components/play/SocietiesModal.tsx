"use client";

import { useEffect, useState, useMemo } from "react";
import OverlayModal from "./OverlayModal";
import { Users, Plus, Shield, ArrowRight, TrendingUp, Info } from "lucide-react";
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

export default function SocietiesModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [societies, setSocieties] = useState<Society[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<"browse" | "my">("browse");

    const apiBase = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!open) return;
        fetchSocieties();
    }, [open]);

    const fetchSocieties = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${apiBase}/api/societies`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error("Failed to load societies");
            const data = await res.json();
            setSocieties(data);
        } catch (e) {
            setError(String(e));
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

    const filteredSocieties = societies.filter((s) =>
        tab === "my" ? s.myRole : !s.myRole
    );

    return (
        <OverlayModal open={open} onClose={onClose} title="Societies" maxWidthClassName="max-w-lg">
            <div className="flex flex-col gap-4">
                {/* Tabs */}
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
                    <div className="py-6 text-center text-brand-red text-sm font-bold bg-brand-red/5 rounded-xl border border-brand-red/20">
                        {error}
                    </div>
                ) : filteredSocieties.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                            <Users size={32} />
                        </div>
                        <div className="text-sm font-bold text-brand-dark/40">
                            {tab === "my" ? "You haven't joined any societies yet" : "No societies available to join"}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
                        {filteredSocieties.map((s) => (
                            <div
                                key={s.id}
                                className="bg-white border-2 border-black/[0.03] rounded-2xl p-4 shadow-sm hover:border-[rgba(212,175,55,0.3)] transition-colors group"
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
                                        <button className="h-10 px-4 rounded-xl bg-black/5 text-[10px] font-black uppercase tracking-widest text-brand-dark/60">
                                            View
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleJoin(s.id)}
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
        </OverlayModal>
    );
}
