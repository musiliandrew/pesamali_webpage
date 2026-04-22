"use client";

import { useEffect, useState, useMemo } from "react";
import { Bell, CheckCircle2, Trash2, Gift, UserPlus, Trophy, Info, XCircle, Clock } from "lucide-react";
import OverlayModal from "./OverlayModal";
import { getApiBaseUrl } from "@/lib/env";
import { getToken } from "@/lib/auth";

type NotificationItem = {
    id: string;
    type: string;
    payload: any;
    read: boolean;
    createdAt: string;
};

export default function NotificationsModal({
    open,
    onClose,
    onRefreshCount,
}: {
    open: boolean;
    onClose: () => void;
    onRefreshCount?: () => void;
}) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const apiBase = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (open) fetchNotifications();
    }, [open]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/notifications`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                setNotifications(await res.json());
                onRefreshCount?.();
            }
        } catch { } finally {
            setLoading(false);
        }
    };

    const markRead = async (id: string) => {
        try {
            const res = await fetch(`${apiBase}/api/notifications/${id}/read`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
                onRefreshCount?.();
            }
        } catch { }
    };

    const markAllRead = async () => {
        try {
            const res = await fetch(`${apiBase}/api/notifications/read-all`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                onRefreshCount?.();
            }
        } catch { }
    };

    const deleteNotif = async (id: string) => {
        try {
            const res = await fetch(`${apiBase}/api/notifications/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                onRefreshCount?.();
            }
        } catch { }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'gift': return <Gift className="text-emerald-500" size={20} />;
            case 'challenge_invite': return <Trophy className="text-brand-gold" size={20} />;
            case 'friend_request': return <UserPlus className="text-blue-500" size={20} />;
            case 'friend_accept': return <CheckCircle2 className="text-emerald-600" size={20} />;
            case 'streak_save': return <Clock className="text-orange-500" size={20} />;
            default: return <Info className="text-brand-dark/40" size={20} />;
        }
    };

    const getMessage = (n: NotificationItem) => {
        const p = n.payload;
        switch (n.type) {
            case 'gift': return `Received a gift of ${p.amount} Points from ${p.fromName}!`;
            case 'challenge_invite': return `${p.fromName} challenged you to a game for ${p.dreamName || 'a dream'}!`;
            case 'friend_request': return `${p.fromName} sent you a friend request.`;
            case 'friend_accept': return `${p.fromName} accepted your friend request!`;
            case 'streak_save': return `${p.fromName} saved your streak! Keep it going!`;
            default: return "New notification received.";
        }
    };

    return (
        <OverlayModal open={open} onClose={onClose} title="Notifications" maxWidthClassName="max-w-md">
            <div className="flex flex-col gap-4 max-h-[70vh]">
                <div className="flex items-center justify-between px-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
                        {notifications.length} Total
                    </div>
                    {notifications.some(n => !n.read) && (
                        <button
                            onClick={markAllRead}
                            className="text-[10px] font-black uppercase tracking-widest text-brand-gold hover:opacity-70 transition"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
                    {loading && notifications.length === 0 ? (
                        <div className="py-20 text-center animate-pulse">
                            <Bell className="mx-auto text-brand-dark/10 mb-3" size={40} />
                            <div className="text-xs font-bold text-brand-dark/20 uppercase">Checking for updates...</div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-black/5 mx-auto flex items-center justify-center mb-4 text-brand-dark/10">
                                <Bell size={32} />
                            </div>
                            <div className="text-sm font-black text-brand-dark/40 uppercase">All caught up!</div>
                            <div className="text-[10px] font-bold text-brand-dark/20 uppercase mt-1">No new notifications</div>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`group p-4 rounded-3xl border-2 transition-all ${n.read ? 'bg-white border-black/[0.03] opacity-60' : 'bg-[#fefcf3] border-brand-gold/30 shadow-sm'}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${n.read ? 'bg-black/5' : 'bg-brand-gold/10'}`}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-1">
                                            <div className={`text-[11px] font-black uppercase tracking-tight leading-tight ${n.read ? 'text-brand-dark/60' : 'text-brand-dark'}`}>
                                                {getMessage(n)}
                                            </div>
                                            {!n.read && (
                                                <div className="w-2 h-2 rounded-full bg-brand-gold shrink-0 mt-1 ml-2" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] font-bold text-brand-dark/30 uppercase">
                                            <Clock size={10} />
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-black/[0.03]">
                                    {!n.read && (
                                        <button
                                            onClick={() => markRead(n.id)}
                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotif(n.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-50 text-brand-dark/20 hover:text-red-500 transition"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </OverlayModal>
    );
}
