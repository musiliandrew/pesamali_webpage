"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getToken, validateToken } from "@/lib/auth";

export default function PlayIndexPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const token = getToken();
      if (!token) {
        router.replace("/play/login");
        return;
      }

      const ok = await validateToken(token).catch(() => false);
      if (cancelled) return;

      if (ok) {
        router.replace("/play/lobby");
      } else {
        clearAuth();
        router.replace("/play/login");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-dark text-brand-cream">
      <div className="text-center">
        <div className="text-brand-gold font-bold text-lg">Loading…</div>
      </div>
    </main>
  );
}
