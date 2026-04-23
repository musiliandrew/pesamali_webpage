"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { getApiBaseUrl } from "@/lib/env";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div />}> 
            <ResetPasswordInner />
        </Suspense>
    );
}

function ResetPasswordInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const otp = searchParams.get("otp") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const apiBase = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!email || !otp) {
            router.replace("/play/forgot-password");
        }
    }, [email, otp, router]);

    const onSubmit = async () => {
        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${apiBase}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, new_password: password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Reset failed");
            }

            setSuccess(true);
            setTimeout(() => {
                router.replace("/play/login");
            }, 3000);
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="h-[100dvh] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/Green_with_visuals_background.jpg')" }}>
                <div className="h-full bg-gradient-to-b from-[rgba(29,53,16,0.95)] to-[rgba(15,25,8,1)] flex flex-col items-center justify-center p-8">
                    <div className="w-24 h-24 rounded-[40px] bg-emerald-500/20 flex items-center justify-center mb-8 border-2 border-emerald-500/30">
                        <ShieldCheck size={48} className="text-emerald-500" />
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase text-center mb-4">Password Reset!</h1>
                    <p className="text-white/60 text-sm font-bold text-center max-w-xs uppercase tracking-widest leading-relaxed">
                        Your security is our priority. <br />Redirecting you to login...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="h-[100dvh] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/Green_with_visuals_background.jpg')" }}>
            <div className="h-full bg-gradient-to-b from-[rgba(29,53,16,0.92)] to-[rgba(15,25,8,0.98)] flex flex-col justify-end">
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                    <div className="w-20 h-20 rounded-[32px] bg-brand-gold/20 flex items-center justify-center mb-8 border-2 border-brand-gold/30 shadow-2xl">
                        <KeyRound size={40} className="text-brand-gold" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight text-center mb-2">New Password</h1>
                    <p className="text-white/60 text-[10px] font-black text-center max-w-xs uppercase tracking-widest">
                        Choose a strong password for <br /><span className="text-brand-gold">{email}</span>
                    </p>
                </div>

                <div className="bg-brand-cream rounded-t-[3.5rem] p-8 pb-12 shadow-[0_-20px_60px_rgba(0,0,0,0.3)]">
                    <div className="max-w-md mx-auto">
                        {error && (
                            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/20 text-red-500 text-[10px] font-black uppercase text-center tracking-widest">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4 mb-8">
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-dark/30 group-focus-within:text-brand-gold transition-colors">
                                    <Lock size={20} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="NEW PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-16 pl-16 pr-6 rounded-2xl bg-white border-2 border-black/5 font-bold text-brand-dark focus:border-brand-gold outline-none transition-all placeholder:text-brand-dark/10 placeholder:font-black placeholder:text-[10px] placeholder:tracking-[2px]"
                                />
                            </div>

                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-dark/30 group-focus-within:text-brand-gold transition-colors">
                                    <Lock size={20} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="CONFIRM PASSWORD"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-16 pl-16 pr-6 rounded-2xl bg-white border-2 border-black/5 font-bold text-brand-dark focus:border-brand-gold outline-none transition-all placeholder:text-brand-dark/10 placeholder:font-black placeholder:text-[10px] placeholder:tracking-[2px]"
                                />
                            </div>
                        </div>

                        <button
                            onClick={onSubmit}
                            disabled={loading || !password || password !== confirmPassword}
                            className="w-full h-16 rounded-2xl bg-brand-dark text-white flex items-center justify-center gap-3 hover:bg-black transition active:scale-95 disabled:opacity-50 shadow-xl"
                        >
                            <span className="text-[11px] font-black uppercase tracking-[4px]">Update Password</span>
                            <ArrowRight size={18} />
                        </button>

                        <button
                            onClick={() => router.replace("/play/login")}
                            className="w-full mt-6 text-[10px] font-black uppercase tracking-[4px] text-brand-dark/40 hover:text-brand-dark transition text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
