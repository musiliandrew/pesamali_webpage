"use client";

import { useState, useEffect } from "react";
import { User, Bell, Shield, Info, LogOut, Save, Camera, Globe, Briefcase, type LucideIcon } from "lucide-react";
import OverlayModal from "./OverlayModal";
import { clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { listProfessionSubs, listProfessions, type Profession, type ProfessionSub } from "@/lib/content";
import { patch, post } from "@/lib/api";

type SettingsUserData = {
    displayName?: string;
    email?: string;
    professionId?: string;
    professionSub?: string | null;
    notificationsEnabled?: boolean;
    streakRemindersEnabled?: boolean;
    countryName?: string;
};

type ToggleProps = {
    checked: boolean;
    onChange: (next: boolean) => void;
    label: string;
    sublabel: string;
};

export default function SettingsModal({
    open,
    onClose,
    userData,
    onRefresh,
}: {
    open: boolean;
    onClose: () => void;
    userData: SettingsUserData | null;
    onRefresh?: () => void;
}) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'about'>('profile');
    const [saving, setSaving] = useState(false);

    // Form States
    const [displayName, setDisplayName] = useState(userData?.displayName || "");
    const [professionId, setProfessionId] = useState(userData?.professionId || "");
    const [professionSub, setProfessionSub] = useState<string>(userData?.professionSub || "");
    const [notifEnabled, setNotifEnabled] = useState(!!userData?.notificationsEnabled);
    const [streakReminders, setStreakReminders] = useState(!!userData?.streakRemindersEnabled);

    const [professions, setProfessions] = useState<Profession[]>([]);
    const [professionSubs, setProfessionSubs] = useState<ProfessionSub[]>([]);
    const [loadingProfessions, setLoadingProfessions] = useState(false);
    const [loadingSubs, setLoadingSubs] = useState(false);

    useEffect(() => {
        if (userData) {
            setDisplayName(userData.displayName || "");
            setProfessionId(userData.professionId || "");
            setProfessionSub(userData.professionSub || "");
            setNotifEnabled(!!userData.notificationsEnabled);
            setStreakReminders(!!userData.streakRemindersEnabled);
        }
    }, [userData]);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;

        const run = async () => {
            setLoadingProfessions(true);
            try {
                const data = await listProfessions();
                if (!cancelled) setProfessions(Array.isArray(data) ? data : []);
            } catch {
                if (!cancelled) setProfessions([]);
            } finally {
                if (!cancelled) setLoadingProfessions(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        if (!professionId) {
            setProfessionSubs([]);
            return;
        }

        let cancelled = false;
        const run = async () => {
            setLoadingSubs(true);
            try {
                const data = await listProfessionSubs(professionId);
                if (!cancelled) setProfessionSubs(Array.isArray(data) ? data : []);
            } catch {
                if (!cancelled) setProfessionSubs([]);
            } finally {
                if (!cancelled) setLoadingSubs(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [open, professionId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await patch("/api/auth/me", {
                    display_name: displayName,
                    profession_id: professionId,
                    profession_sub: professionSub || null,
                    notifications_enabled: notifEnabled ? 1 : 0,
                    streak_reminders_enabled: streakReminders ? 1 : 0,
            });
            onRefresh?.();
            alert("Settings updated successfully!");
        } catch {
            alert("Network error. Try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            (async () => {
                try {
                    await post<unknown>("/api/auth/logout", {});
                } catch {
                    // ignore
                } finally {
                    clearAuth();
                    router.push("/play/login");
                }
            })();
        }
    };

    const Toggle = ({ checked, onChange, label, sublabel }: ToggleProps) => (
        <div className="flex items-center justify-between py-4 border-b border-black/[0.03]">
            <div className="flex-1">
                <div className="text-[11px] font-black uppercase text-brand-dark tracking-tight">{label}</div>
                <div className="text-[9px] font-bold text-brand-dark/40 uppercase mt-0.5">{sublabel}</div>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`w-12 h-6 rounded-full transition-all relative ${checked ? 'bg-brand-gold' : 'bg-black/10'}`}
            >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-7' : 'left-1'}`} />
            </button>
        </div>
    );

    return (
        <OverlayModal open={open} onClose={onClose} title="Settings" maxWidthClassName="max-w-md">
            <div className="flex flex-col h-[70vh]">
                {/* Tabs */}
                <div className="flex gap-2 mb-6 px-1">
                    {([
                        { id: 'profile', icon: User, label: 'Profile' },
                        { id: 'notifications', icon: Bell, label: 'Alerts' },
                        { id: 'about', icon: Info, label: 'About' },
                    ] as Array<{ id: 'profile' | 'notifications' | 'about'; icon: LucideIcon; label: string }>).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-2xl border-2 transition-all ${activeTab === tab.id ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 'bg-white border-black/[0.03] text-brand-dark/40 hover:border-brand-gold/20'}`}
                        >
                            <tab.icon size={18} />
                            <span className="text-[9px] font-black uppercase tracking-wider">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-1">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-[32px] bg-emerald-50 border-4 border-white shadow-xl flex items-center justify-center text-emerald-600">
                                        <User size={40} />
                                    </div>
                                    <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-brand-dark text-white flex items-center justify-center border-2 border-white shadow-lg">
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-black text-brand-dark uppercase tracking-tight">{userData?.displayName}</div>
                                    <div className="text-[10px] font-bold text-brand-dark/40 uppercase mt-1">{userData?.email}</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 ml-1 mb-2 block">Display Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={16} />
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/5 border-none text-[11px] font-black uppercase tracking-wider outline-none focus:ring-2 ring-brand-gold/20"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 ml-1 mb-2 block">Profession</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={16} />
                                        <select
                                            value={professionId}
                                            onChange={(e) => {
                                                setProfessionId(e.target.value);
                                                setProfessionSub("");
                                            }}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/5 border-none text-[11px] font-black uppercase tracking-wider outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="">{loadingProfessions ? "Loading..." : "Select profession"}</option>
                                            {professions.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 ml-1 mb-2 block">Specialization</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={16} />
                                        <select
                                            value={professionSub}
                                            onChange={(e) => setProfessionSub(e.target.value)}
                                            disabled={!professionId || loadingSubs}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/5 border-none text-[11px] font-black uppercase tracking-wider outline-none appearance-none cursor-pointer disabled:opacity-50"
                                        >
                                            <option value="">{!professionId ? "Select profession first" : loadingSubs ? "Loading..." : "Optional"}</option>
                                            {professionSubs.map((s) => (
                                                <option key={s.id} value={s.name}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="divide-y divide-black/[0.03]">
                            <Toggle
                                checked={notifEnabled}
                                onChange={setNotifEnabled}
                                label="Push Notifications"
                                sublabel="Get alerts for match outcomes and gifts"
                            />
                            <Toggle
                                checked={streakReminders}
                                onChange={setStreakReminders}
                                label="Streak Reminders"
                                sublabel="Daily alerts to save your streak"
                            />
                            <Toggle
                                checked={true}
                                onChange={() => { }}
                                label="Game Invites"
                                sublabel="When friends challenge you"
                            />
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="space-y-4 pt-2">
                            {[
                                { icon: Globe, label: 'Language', value: 'English (KE)' },
                                { icon: Shield, label: 'Country', value: userData?.countryName || 'Kenya' },
                                { icon: Info, label: 'Version', value: 'v2.1.0-web' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-black/5">
                                    <div className="flex items-center gap-3">
                                        <item.icon size={16} className="text-brand-gold" />
                                        <span className="text-[11px] font-black uppercase text-brand-dark">{item.label}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-brand-dark/40 uppercase">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-4 border-t border-black/[0.03] space-y-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full h-14 rounded-2xl bg-brand-dark text-white flex items-center justify-center gap-3 hover:bg-black transition active:scale-[0.98] disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={18} />
                                <span className="text-[11px] font-black uppercase tracking-[3px]">Save Changes</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 text-red-500/60 hover:text-red-500 transition"
                    >
                        <LogOut size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Logout Account</span>
                    </button>
                </div>
            </div>
        </OverlayModal>
    );
}
