export default function PesaMaliLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gold gradient for text */}
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d060" />
          <stop offset="30%" stopColor="#d4a843" />
          <stop offset="60%" stopColor="#b8922a" />
          <stop offset="100%" stopColor="#d4a843" />
        </linearGradient>
        {/* Shine highlight */}
        <linearGradient id="goldShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8c86a" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff5c0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e8c86a" stopOpacity="0" />
        </linearGradient>
        {/* Emblem gradient */}
        <linearGradient id="emblemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a843" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        {/* Dark green fill */}
        <linearGradient id="emblemFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d4a0e" />
          <stop offset="100%" stopColor="#1a2e0a" />
        </linearGradient>
      </defs>

      {/* Coin / emblem circle */}
      <circle cx="24" cy="24" r="22" fill="url(#emblemFill)" stroke="url(#emblemGrad)" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="17" fill="none" stroke="url(#goldGrad)" strokeWidth="1" opacity="0.5" />
      {/* Dollar sign in coin */}
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fontFamily="serif"
        fontWeight="900"
        fontSize="22"
        fill="url(#goldGrad)"
      >
        $
      </text>

      {/* PESA text */}
      <text
        x="56"
        y="22"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="18"
        letterSpacing="2"
        fill="url(#goldGrad)"
      >
        PESA
      </text>
      {/* Shine overlay on PESA */}
      <text
        x="56"
        y="22"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="18"
        letterSpacing="2"
        fill="url(#goldShine)"
      >
        PESA
      </text>

      {/* MALI text */}
      <text
        x="120"
        y="22"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="18"
        letterSpacing="2"
        fill="#f5f0e1"
      >
        MALI
      </text>

      {/* Subtitle: THE GAME OF MONEY */}
      <text
        x="56"
        y="38"
        fontFamily="sans-serif"
        fontWeight="600"
        fontSize="8"
        letterSpacing="3"
        fill="url(#goldGrad)"
        opacity="0.7"
      >
        THE GAME OF MONEY
      </text>

      {/* Decorative lines around subtitle */}
      <line x1="56" y1="26" x2="180" y2="26" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}
