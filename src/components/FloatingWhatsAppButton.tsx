"use client";

import { useEffect, useState } from "react";

const WHATSAPP_LINK = "https://chat.whatsapp.com/K0LVCrduHPiJYShQJXbAdM";

export default function FloatingWhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] group"
      aria-label="Join PesaMali WhatsApp community"
    >
      <div className="flex items-center gap-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-2xl shadow-[#25D366]/30 px-4 py-3 border border-white/10 backdrop-blur-sm transition active:scale-[0.99]">
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="22"
            height="22"
            fill="currentColor"
          >
            <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.735 5.476 2.02 7.782L0 32l8.39-2.002A15.946 15.946 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.267 13.267 0 01-6.788-1.858l-.486-.29-5.018 1.197 1.24-4.875-.317-.5A13.307 13.307 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.28-9.907c-.4-.2-2.363-1.163-2.73-1.295-.366-.13-.633-.197-.9.2-.267.397-1.03 1.296-1.263 1.563-.233.267-.466.3-.866.1-.4-.2-1.69-.622-3.218-1.982-1.19-1.06-1.993-2.37-2.226-2.77-.234-.4-.025-.617.175-.816.18-.18.4-.467.6-.7.2-.233.267-.4.4-.666.133-.266.067-.5-.034-.7-.1-.2-.9-2.163-1.233-2.963-.325-.78-.657-.673-.9-.685l-.767-.013c-.266 0-.7.1-1.066.5-.367.4-1.4 1.368-1.4 3.33 0 1.963 1.433 3.863 1.633 4.13.2.267 2.82 4.3 6.832 6.03.955.412 1.7.658 2.28.842.958.305 1.832.262 2.52.16.768-.115 2.363-.966 2.696-1.9.333-.933.333-1.733.234-1.9-.1-.167-.366-.267-.766-.466z" />
          </svg>
        </div>

        <div className="hidden sm:block">
          <div className="text-sm font-extrabold leading-tight">Join WhatsApp</div>
          <div className="text-[11px] text-white/90 font-semibold leading-tight">Community updates</div>
        </div>

        <div className="hidden sm:block w-px h-8 bg-white/15" />

        <div className="hidden sm:block text-xs font-black tracking-widest opacity-90 group-hover:opacity-100 transition">
          OPEN
        </div>
      </div>
    </a>
  );
}
