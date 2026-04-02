"use client";

import { MessageCircle, Users, Bell, ChevronRight } from "lucide-react";

const WHATSAPP_LINK = "https://chat.whatsapp.com/K0LVCrduHPiJYShQJXbAdM";

const perks = [
    {
        icon: Bell,
        title: "First to Know",
        desc: "Get notified the moment PesaMali drops on Play Store & App Store before everyone else.",
    },
    {
        icon: Users,
        title: "Join the Community",
        desc: "Connect with hundreds of players, share strategies, and compete in community tournaments.",
    },
    {
        icon: MessageCircle,
        title: "Direct Updates",
        desc: "Receive game tips, feature announcements, and exclusive beta access straight to WhatsApp.",
    },
];

export default function WhatsAppSection() {
    return (
        <section
            id="community"
            className="relative py-20 sm:py-28 overflow-hidden"
        >
            {/* Background image to match other sections */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: "url('/solid_color_branding.png')" }}
            />
            <div className="absolute inset-0 bg-brand-dark/50" />

            {/* Animated green glow blobs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-olive/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#25D366]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Section header matched to others */}
                <div className="mb-16">
                    <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-2">
                        <MessageCircle size={16} className="text-[#25D366] animate-pulse" />
                        Community
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-cream mt-3 mb-5 leading-tight">
                        Join Our <span className="text-[#25D366]">WhatsApp Community</span>
                    </h2>
                    <p className="text-brand-cream/60 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        Be part of the PesaMali inner circle. Get exclusive launch updates,
                        early access, and connect with fellow players before the official release.
                    </p>
                </div>

                {/* Perks grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
                    {perks.map((perk) => (
                        <div
                            key={perk.title}
                            className="bg-brand-green/30 backdrop-blur-sm border border-brand-olive/30 rounded-2xl p-6 hover:border-[#25D366]/40 transition-all group"
                        >
                            <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 flex items-center justify-center mb-4 group-hover:bg-[#25D366]/20 transition-colors">
                                <perk.icon size={22} className="text-[#25D366]" />
                            </div>
                            <h3 className="text-brand-cream font-bold text-lg mb-2">
                                {perk.title}
                            </h3>
                            <p className="text-brand-cream/50 text-sm leading-relaxed">
                                {perk.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Main CTA */}
                <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-10 py-5 rounded-full text-lg transition-all hover:scale-105 shadow-2xl shadow-[#25D366]/30 group"
                >
                    {/* WhatsApp SVG icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        width="26"
                        height="26"
                        fill="currentColor"
                        className="group-hover:animate-bounce"
                    >
                        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.735 5.476 2.02 7.782L0 32l8.39-2.002A15.946 15.946 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.267 13.267 0 01-6.788-1.858l-.486-.29-5.018 1.197 1.24-4.875-.317-.5A13.307 13.307 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.28-9.907c-.4-.2-2.363-1.163-2.73-1.295-.366-.13-.633-.197-.9.2-.267.397-1.03 1.296-1.263 1.563-.233.267-.466.3-.866.1-.4-.2-1.69-.622-3.218-1.982-1.19-1.06-1.993-2.37-2.226-2.77-.234-.4-.025-.617.175-.816.18-.18.4-.467.6-.7.2-.233.267-.4.4-.666.133-.266.067-.5-.034-.7-.1-.2-.9-2.163-1.233-2.963-.325-.78-.657-.673-.9-.685l-.767-.013c-.266 0-.7.1-1.066.5-.367.4-1.4 1.368-1.4 3.33 0 1.963 1.433 3.863 1.633 4.13.2.267 2.82 4.3 6.832 6.03.955.412 1.7.658 2.28.842.958.305 1.832.262 2.52.16.768-.115 2.363-.966 2.696-1.9.333-.933.333-1.733.234-1.9-.1-.167-.366-.267-.766-.466z" />
                    </svg>
                    Join the Community
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>

                <p className="text-brand-cream/30 text-xs mt-4">
                    Free to join · No spam · Updates only
                </p>
            </div>
        </section>
    );
}
