"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Mail, ArrowRight, RefreshCw, Smartphone } from "lucide-react";
import { getApiBaseUrl } from "@/lib/env";
import { setToken } from "@/lib/auth";

export default function VerifyOtpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const mode = searchParams.get("mode") || "register"; // 'register' or 'reset'

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendTimer, setResendTimer] = useState(60);
    const apiBase = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!email) {
            router.replace("/play/login");
        }
    }, [email, router]);

    useEffect(() => {
        if (resendTimer > 0) {
            const t = setInterval(() => setResendTimer(v => v - 1), 1000);
            return () => clearInterval(t);
        }
    }, [resendTimer]);

    const handleInput = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const onVerify = async () => {
        const fullOtp = otp.join("");
        if (fullOtp.length !== 6) return;

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${apiBase}/api/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: fullOtp }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Invalid code");
            }

            const data = await res.json();

            if (mode === 'reset') {
                router.push(`/play/reset-password?email=${encodeURIComponent(email)}&otp=${fullOtp}`);
            } else {
                if (data.token) {
                    setToken(data.token);
                    localStorage.setItem("pm_user", JSON.stringify(data.user));
                    router.replace("/play/lobby");
                } else {
                    router.replace("/play/login?verified=1");
                }
            }
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    };

    const onResend = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        try {
            await fetch(`${apiBase}/api/auth/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            setResendTimer(60);
        } catch { } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-[100dvh] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/Green_with_visuals_background.jpg')" }}>
            <div className="h-full bg-gradient-to-b from-[rgba(29,53,16,0.92)] to-[rgba(15,25,8,0.98)] flex flex-col justify-end">
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                    <div className="w-20 h-20 rounded-[32px] bg-brand-gold/20 flex items-center justify-center mb-8 border-2 border-brand-gold/30 shadow-2xl animate-pulse">
                        <ShieldCheck size={40} className="text-brand-gold" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight text-center mb-2">Verify Account</h1>
                    <p className="text-white/60 text-sm font-bold text-center max-w-xs uppercase tracking-wider">
                        We sent a 6-digit code to <br /><span className="text-brand-gold">{email}</span>
                    </p>
                </div>

                <div className="bg-brand-cream rounded-t-[3.5rem] p-8 pb-12 shadow-[0_-20px_60px_rgba(0,0,0,0.3)]">
                    <div className="max-w-md mx-auto">
                        {error && (
                            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/20 text-red-500 text-[10px] font-black uppercase text-center tracking-widest">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-between gap-2 mb-8">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={el => { inputRefs.current[idx] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleInput(idx, e.target.value)}
                                    onKeyDown={e => handleKeyDown(idx, e)}
                                    className="w-full h-16 rounded-2xl bg-white border-2 border-black/5 text-center text-2xl font-black text-brand-dark focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 outline-none transition-all"
                                />
                            ))}
                        </div>

                        <button
                            onClick={onVerify}
                            disabled={loading || otp.join("").length < 6}
                            className="w-full h-16 rounded-2xl bg-brand-dark text-white flex items-center justify-center gap-3 hover:bg-black transition active:scale-95 disabled:opacity-50 shadow-xl mb-6"
                        >
                            <span className="text-[11px] font-black uppercase tracking-[4px]">Confirm Verification</span>
                            <ArrowRight size={18} />
                        </button>

                        <div className="flex flex-col items-center gap-4">
                            <button
                                onClick={onResend}
                                disabled={resendTimer > 0}
                                className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${resendTimer > 0 ? 'text-brand-dark/20' : 'text-brand-gold hover:text-brand-gold-light'}`}
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                Resend Code {resendTimer > 0 && `(${resendTimer}s)`}
                            </button>

                            <button
                                onClick={() => router.replace("/play/login")}
                                className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 hover:text-brand-dark transition"
                            >
                                Cancel and return
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
