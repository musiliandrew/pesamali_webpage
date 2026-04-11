"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Coins, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { getApiBaseUrl } from "@/lib/env";
import { getToken, setToken, validateToken } from "@/lib/auth";

type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatar?: string | null;
  professionId: string;
  professionSub?: string | null;
  pesaPoints: number;
  societyId?: string | null;
  streak: number;
  friendsCount?: number;
  role: string;
  age?: number;
  pesaTokens?: number;
};

export default function PlayLoginPage() {
  const router = useRouter();

  const apiBase = useMemo(() => {
    return getApiBaseUrl();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const token = getToken();
      if (!token) return;
      const ok = await validateToken(token).catch(() => false);
      if (cancelled) return;
      if (ok) router.replace("/play/lobby");
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length >= 6 && !loading;

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Login failed (${res.status})`);
      }

      const data = (await res.json()) as { token: string; user: AuthUser };
      if (!data?.token) throw new Error("No token returned");

      setToken(data.token);
      localStorage.setItem("pm_user", JSON.stringify(data.user || null));

      router.replace("/play/lobby");
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

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
              <div className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
                Welcome Back
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="h-[2px] w-8 bg-brand-gold rounded-full" />
                <Coins size={16} className="text-brand-gold" />
                <div className="h-[2px] w-8 bg-brand-gold rounded-full" />
              </div>
              <div className="hidden sm:block text-base text-white/80 mt-3 font-semibold">
                Sign in to continue your financial journey
              </div>
            </div>
          </div>

          <div className="bg-brand-cream text-brand-dark rounded-t-[32px] overflow-hidden relative flex-shrink-0">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold" />

            <div className="w-full max-w-5xl mx-auto px-6 pt-6 sm:pt-10 pb-8 sm:pb-10">
              <div className="max-w-xl mx-auto">
                {error && (
                  <div className="bg-[rgba(192,57,43,0.12)] border-2 border-[rgba(192,57,43,0.55)] rounded-2xl p-3 mb-4">
                    <div className="text-xs text-[rgb(192,57,43)] font-extrabold text-center">
                      {error}
                    </div>
                  </div>
                )}

                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-[10px] sm:text-xs font-extrabold text-[rgba(60,45,30,0.75)] uppercase tracking-wider ml-1">
                      📧 Email Address
                    </div>
                    <div className="flex items-center bg-white border-2 border-[rgba(139,115,85,0.28)] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-sm">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[rgba(45,80,22,0.10)] rounded-xl flex items-center justify-center mr-3">
                        <Mail size={18} className="text-[rgb(45,80,22)]" />
                      </div>
                      <input
                        className="flex-1 text-sm sm:text-base text-[rgb(26,26,26)] font-semibold outline-none"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-[10px] sm:text-xs font-extrabold text-[rgba(60,45,30,0.75)] uppercase tracking-wider ml-1">
                      🔒 Password
                    </div>
                    <div className="flex items-center bg-white border-2 border-[rgba(139,115,85,0.28)] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-sm">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[rgba(45,80,22,0.10)] rounded-xl flex items-center justify-center mr-3">
                        <Lock size={18} className="text-[rgb(45,80,22)]" />
                      </div>
                      <input
                        className="flex-1 text-sm sm:text-base text-[rgb(26,26,26)] font-semibold outline-none"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="ml-2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff size={20} className="text-[rgba(93,78,55,1)]" />
                        ) : (
                          <Eye size={20} className="text-[rgba(93,78,55,1)]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    className="w-full py-4 sm:py-5 rounded-2xl shadow-lg bg-brand-gold hover:bg-brand-gold-light disabled:opacity-50 transition active:scale-[0.99]"
                  >
                    <div className="text-white text-center text-base sm:text-lg font-extrabold tracking-wide">
                      {loading ? "Signing In..." : "🎮 Sign In & Play"}
                    </div>
                  </button>

                  <div className="flex flex-col items-center gap-3 mt-1">
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-xs sm:text-sm text-[rgba(60,45,30,0.7)] font-semibold">
                        Don&apos;t have an account?
                      </div>
                      <Link
                        href="/play/register"
                        className="bg-[rgba(45,80,22,0.10)] px-3 py-1 sm:px-4 sm:py-2 rounded-full font-extrabold text-[rgb(45,80,22)] text-xs sm:text-sm"
                      >
                        Sign Up 🚀
                      </Link>
                    </div>

                    <Link
                      href="/play/forgot-password"
                      className="text-xs sm:text-sm text-brand-gold font-bold hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    onClick={() => router.replace("/")}
                    className="w-full text-xs text-brand-dark/60 hover:text-brand-dark transition pt-2"
                  >
                    Back to landing page
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
