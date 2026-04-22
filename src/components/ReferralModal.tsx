"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, Users, Gift, Share2, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getApiBaseUrl } from "@/lib/env";

interface ReferralStats {
    code: string;
    totalReferred: number;
    tokensEarned: number;
    pendingVerifications: number;
    societyRank?: number;
}

export default function ReferralModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user) {
            // Mocking stats for now or fetch from /api/social/referrals if implemented
            setStats({
                code: user.referralCode || "GETTING_CODE...",
                totalReferred: 0,
                tokensEarned: 0,
                pendingVerifications: 0,
                societyRank: 0
            });
            setLoading(false);
        }
    }, [isOpen, user]);

    const handleCopy = () => {
        if (stats?.code) {
            navigator.clipboard.writeText(stats.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-brand-cream rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border-b-[6px] border-brand-gold">
                {/* Header Gradient */}
                <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark p-8 pb-12">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white/80 transition"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-brand-gold/20 rounded-2xl flex items-center justify-center border border-brand-gold/30">
                            <Gift className="text-brand-gold" size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Invite Friends</h2>
                    </div>
                    <p className="text-white/70 font-bold uppercase tracking-[2px] text-[10px]">Grow your circle & earn tokens</p>
                </div>

                {/* Content */}
                <div className="p-8 -mt-8 bg-brand-cream rounded-t-[40px] relative">
                    <div className="space-y-8">
                        {/* Referral Code Card */}
                        <div className="bg-white border-2 border-brand-gold/20 rounded-[32px] p-6 shadow-sm">
                            <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest mb-4 text-center">Your Personal Invite Code</p>
                            <div className="flex items-center justify-between bg-brand-primary/5 border-2 border-dashed border-brand-primary/20 rounded-2xl p-4">
                                <span className="text-3xl font-black text-brand-primary tracking-tighter uppercase ml-2">
                                    {stats?.code}
                                </span>
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition ${copied ? 'bg-green-500 text-white' : 'bg-brand-primary text-white hover:bg-brand-primary-dark'
                                        }`}
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* Reward Tiers */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border-2 border-black/5 rounded-3xl p-4 flex flex-col items-center text-center">
                                <div className="text-2xl font-black text-brand-gold tracking-tighter mb-1">3 TOKENS</div>
                                <p className="text-[9px] font-bold text-brand-dark/50 uppercase leading-none">For You</p>
                                <div className="mt-3 w-8 h-8 bg-brand-gold/10 rounded-full flex items-center justify-center">
                                    <Award size={14} className="text-brand-gold" />
                                </div>
                            </div>
                            <div className="bg-white border-2 border-black/5 rounded-3xl p-4 flex flex-col items-center text-center">
                                <div className="text-2xl font-black text-brand-primary tracking-tighter mb-1">1 TOKEN</div>
                                <p className="text-[9px] font-bold text-brand-dark/50 uppercase leading-none">For Friend</p>
                                <div className="mt-3 w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                    <Users size={14} className="text-brand-primary" />
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="bg-brand-dark rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-white/90 font-black uppercase tracking-widest text-[10px]">Your Stats</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">Live</span>
                                </div>
                            </div>
                            <div className="flex justify-around items-center">
                                <div className="items-center text-center">
                                    <div className="text-xl font-black text-white">{stats?.totalReferred}</div>
                                    <div className="text-[8px] font-bold text-white/30 uppercase">Friends</div>
                                </div>
                                <div className="h-8 w-[1px] bg-white/10" />
                                <div className="items-center text-center">
                                    <div className="text-xl font-black text-white">{stats?.tokensEarned}</div>
                                    <div className="text-[8px] font-bold text-white/30 uppercase">Earned</div>
                                </div>
                                <div className="h-8 w-[1px] bg-white/10" />
                                <div className="items-center text-center">
                                    <div className="text-xl font-black text-brand-gold">{stats?.societyRank || '-'}</div>
                                    <div className="text-[8px] font-bold text-white/30 uppercase">Rank</div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-5 bg-brand-gold rounded-3xl flex items-center justify-center gap-3 shadow-lg hover:shadow-brand-gold/20 transition active:scale-[0.98]">
                            <Share2 size={20} className="text-white" />
                            <span className="text-lg font-black text-white uppercase tracking-wider">Share My Link</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
