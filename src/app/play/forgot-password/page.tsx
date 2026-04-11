"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Coins, Mail, Lock, Key, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { getApiBaseUrl } from "@/lib/env";

type Step = 'REQUEST' | 'VERIFY' | 'RESET';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('REQUEST');
    const [loading, setLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const apiBase = useMemo(() => getApiBaseUrl(), []);

    const handleRequestOTP = async () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStep('VERIFY');
            } else {
                const data = await res.json();
                setError(data.detail || "Failed to send OTP");
            }
        } catch (e) {
            setError("Check your internet connection");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setError("Enter the 6-digit code sent to your email");
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            if (res.ok) {
                setStep('RESET');
            } else {
                const data = await res.json();
                setError(data.detail || "Invalid OTP");
            }
        } catch (e) {
            setError("Check your internet connection");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, new_password: newPassword }),
            });

            if (res.ok) {
                setSuccessMessage("Your password has been reset successfully!");
                setTimeout(() => router.replace('/play/login'), 2000);
            } else {
                const data = await res.json();
                setError(data.detail || "Reset failed");
            }
        } catch (e) {
            setError("Check your internet connection");
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label: string, icon: any, value: string, onChange: (v: string) => void, placeholder: string, type = "text") => (
        <div className="space-y-2">
            <div className="text-xs font-extrabold text-[rgba(60,45,30,0.75)] uppercase tracking-wider ml-1">
                {label}
            </div>
            <div className="flex items-center bg-white border-2 border-[rgba(139,115,85,0.28)] rounded-2xl px-5 py-4 shadow-sm focus-within:border-brand-gold transition-colors">
                <div className="w-10 h-10 bg-[rgba(45,80,22,0.10)] rounded-xl flex items-center justify-center mr-3">
                    {icon}
                </div>
                <input
                    className="flex-1 text-base text-[rgb(26,26,26)] font-semibold outline-none"
                    type={type === "password" && showPassword ? "text" : type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
                {type === "password" && (
                    <button
                        type="button"
                        className="ml-2 w-8 h-8 flex items-center justify-center text-brand-dark/40"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <main
            className="h-[100dvh] overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: "url('/Green_with_visuals_background.jpg')" }}
        >
            <div className="h-full bg-gradient-to-b from-[rgba(29,53,16,0.85)] to-[rgba(15,25,8,0.95)] overflow-y-auto sm:overflow-hidden">
                <div className="min-h-full sm:h-full flex flex-col justify-between sm:justify-end">
                    <div className="w-full max-w-5xl mx-auto px-6 pt-8 sm:pt-24 pb-6 sm:pb-12 flex flex-col items-center flex-shrink-0">
                        <div className="mb-4 sm:mb-6">
                            <Image
                                src="/coverpesa_mali_page-0004-removebg-preview.png"
                                alt="PesaMali"
                                width={900}
                                height={420}
                                priority
                                className="w-[min(400px,75vw)] sm:w-[min(520px,85vw)] h-auto"
                            />
                        </div>

                        <div className="items-center text-center">
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
                                {step === 'REQUEST' ? 'Recover Account' : step === 'VERIFY' ? 'Verify Code' : 'New Password'}
                            </h1>
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-[2px] w-8 bg-brand-gold rounded-full" />
                                <ShieldCheck size={14} className="text-brand-gold" />
                                <div className="h-[2px] w-8 bg-brand-gold rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-cream text-brand-dark rounded-t-[32px] overflow-hidden relative flex-shrink-0">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold" />

                        <div className="w-full max-w-5xl mx-auto px-6 pt-6 sm:pt-10 pb-8 sm:pb-12">
                            <div className="max-w-xl mx-auto">
                                <button
                                    onClick={() => step === 'REQUEST' ? router.back() : setStep(step === 'RESET' ? 'VERIFY' : 'REQUEST')}
                                    className="flex items-center gap-2 text-brand-green font-bold mb-4 sm:mb-6 hover:translate-x-[-4px] transition-transform text-sm"
                                >
                                    <ArrowLeft size={16} />
                                    Go Back
                                </button>

                                {error && (
                                    <div className="bg-[rgba(192,57,43,0.12)] border-2 border-[rgba(192,57,43,0.55)] rounded-2xl p-3 mb-4 text-center text-brand-red font-bold text-xs">
                                        {error}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="bg-green-100 border-2 border-green-500 rounded-2xl p-3 mb-4 text-center text-green-700 font-bold text-xs">
                                        {successMessage}
                                    </div>
                                )}

                                <div className="space-y-4 sm:space-y-6">
                                    {step === 'REQUEST' && renderInput("📧 Email", <Mail size={18} className="text-brand-green" />, email, setEmail, "your@email.com")}

                                    {step === 'VERIFY' && renderInput("🔑 OTP Code", <Key size={18} className="text-brand-green" />, otp, setOtp, "123456")}

                                    {step === 'RESET' && (
                                        <>
                                            {renderInput("🔒 New Password", <Lock size={18} className="text-brand-green" />, newPassword, setNewPassword, "Minimum 6 characters", "password")}
                                            {renderInput("🛡️ Confirm", <Lock size={18} className="text-brand-green" />, confirmPassword, setConfirmPassword, "Re-type password", "password")}
                                        </>
                                    )}

                                    <button
                                        onClick={step === 'REQUEST' ? handleRequestOTP : step === 'VERIFY' ? handleVerifyOTP : handleResetPassword}
                                        disabled={loading}
                                        className="w-full py-4 sm:py-5 rounded-2xl shadow-lg bg-brand-gold hover:bg-brand-gold-light text-white text-base sm:text-lg font-extrabold tracking-wide transition active:scale-[0.99] disabled:opacity-50"
                                    >
                                        {loading ? "Processing..." : step === 'REQUEST' ? "Send OTP 📧" : step === 'VERIFY' ? "Verify Code ✅" : "Save Password 🎮"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
