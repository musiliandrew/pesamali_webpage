"use client";

import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "small" | "medium" | "large";

export default function Button({
  title,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  ...rest
}: {
  title: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled">) {
  const isDisabled = disabled || loading;

  const base =
    "inline-flex items-center justify-center rounded-xl border shadow-sm transition active:scale-[0.99] font-semibold";

  const sizeClass =
    size === "small"
      ? "px-3 py-2 min-h-8 text-sm"
      : size === "large"
        ? "px-6 py-4 min-h-[52px] text-base"
        : "px-4 py-3 min-h-11 text-sm";

  const variantClass = (() => {
    if (isDisabled) return "bg-[#9CA3AF] text-[rgba(93,78,55,1)] border-transparent";
    switch (variant) {
      case "primary":
        return "bg-[rgb(45,80,22)] text-white border-transparent";
      case "secondary":
        return "bg-[rgb(255,254,248)] text-[rgb(26,26,26)] border-[rgb(212,175,55)]";
      case "danger":
        return "bg-[rgb(244,67,54)] text-white border-transparent";
      case "ghost":
        return "bg-transparent text-[rgb(45,80,22)] border-transparent shadow-none";
      default:
        return "bg-[rgb(45,80,22)] text-white border-transparent";
    }
  })();

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={
        base +
        " " +
        sizeClass +
        " " +
        variantClass +
        (fullWidth ? " w-full" : "") +
        (className ? " " + className : "")
      }
    >
      {loading ? "Loading..." : title}
    </button>
  );
}
