"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export default function OverlayModal({
  open,
  onClose,
  title,
  children,
  maxWidthClassName = "max-w-md",
  dark = false,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidthClassName?: string;
  dark?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={
          `relative w-full rounded-[2.5rem] border shadow-2xl overflow-hidden transition-all duration-500 ${dark
            ? "bg-[#0a1f1a] text-white border-brand-gold/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            : "bg-brand-cream text-brand-dark border-[rgba(212,175,55,0.35)]"
          } ` + maxWidthClassName
        }
        role="dialog"
        aria-modal="true"
      >
        {(title ?? null) !== null && (
          <div className={`flex items-center justify-between px-6 py-5 border-b ${dark ? "border-white/10" : "border-[rgba(139,115,85,0.20)]"
            }`}>
            <div className={`text-sm font-black uppercase tracking-[2px] ${dark ? "text-brand-gold" : ""}`}>{title}</div>
            <button
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${dark ? "hover:bg-white/10 text-white/40" : "hover:bg-black/5"
                }`}
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className={dark ? "" : "p-5"}>{children}</div>
      </div>
    </div>
  );
}
