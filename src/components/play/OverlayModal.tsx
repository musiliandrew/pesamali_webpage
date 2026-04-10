"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export default function OverlayModal({
  open,
  onClose,
  title,
  children,
  maxWidthClassName = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidthClassName?: string;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className={
          "relative w-full rounded-2xl bg-brand-cream text-brand-dark border border-[rgba(212,175,55,0.35)] shadow-2xl overflow-hidden " +
          maxWidthClassName
        }
        role="dialog"
        aria-modal="true"
      >
        {(title ?? null) !== null && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(139,115,85,0.20)]">
            <div className="text-base font-extrabold">{title}</div>
            <button
              className="w-10 h-10 rounded-xl hover:bg-black/5 flex items-center justify-center"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
