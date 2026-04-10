"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PwaClient() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  const isStandalone = useMemo(() => {
    if (typeof window === "undefined") return false;
    const nav = window.navigator as Navigator & { standalone?: boolean };
    return window.matchMedia?.("(display-mode: standalone)")?.matches || !!nav.standalone;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;

    const registerSw = async () => {
      try {
        if ("serviceWorker" in navigator) {
          await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        }
      } catch {
        // ignore
      }
    };

    registerSw();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onInstall = async () => {
    if (!deferredPrompt) return;
    setCanInstall(false);
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } finally {
      setDeferredPrompt(null);
    }
  };

  if (isStandalone) return null;
  if (!canInstall) return null;

  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md p-4">
        <div className="text-white font-extrabold">Install PesaMali</div>
        <div className="text-white/80 text-sm mt-1">Add this app to your home screen for the best experience.</div>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={() => {
              setCanInstall(false);
              setDeferredPrompt(null);
            }}
            className="flex-1 rounded-xl border border-white/15 px-4 py-3 font-extrabold text-white/80"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={onInstall}
            className="flex-1 rounded-xl bg-brand-gold hover:bg-brand-gold-light px-4 py-3 font-extrabold text-white"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
