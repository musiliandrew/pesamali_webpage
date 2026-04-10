import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import Image from "next/image";
import { ShoppingBag, MessageCircle, CheckCircle, Package, Users, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function ShopPage() {
    const whatsappNumber = "254759313238";
    const message = "I'm interested in buying the PesaMali Physical Board Game. Could you provide more details on pricing and delivery?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="min-h-screen flex flex-col bg-brand-dark relative overflow-hidden">
            {/* Fixed Background for continuity */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: "url('/solid_color_branding.png')" }}
            />
            <div className="fixed inset-0 z-0 bg-brand-dark/40" />

            <Navbar />

            <main className="flex-grow pt-32 pb-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex mb-8 text-sm font-medium text-brand-cream/60">
                        <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-brand-gold font-bold">Shop</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Product Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-brand-olive/30 shadow-2xl group">
                                <Image
                                    src="/Students Playing the game.jpeg"
                                    alt="Students playing PesaMali Board Game"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="bg-brand-gold/90 text-brand-dark text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block">
                                        Physical Edition
                                    </span>
                                    <h2 className="text-2xl font-bold text-white">Experience Financial Education Hands-on</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="aspect-square rounded-2xl overflow-hidden border border-brand-olive/20 hover:border-brand-gold/50 transition-all cursor-pointer">
                                    <Image src="/game_icon.png" alt="Game Icon" width={200} height={200} className="w-full h-full object-cover" />
                                </div>
                                <div className="aspect-square rounded-2xl overflow-hidden border border-brand-olive/20 hover:border-brand-gold/50 transition-all cursor-pointer bg-brand-olive/20 flex items-center justify-center">
                                    <Package className="text-brand-gold" size={32} />
                                </div>
                                <div className="aspect-square rounded-2xl overflow-hidden border border-brand-olive/20 hover:border-brand-gold/50 transition-all cursor-pointer bg-brand-olive/20 flex items-center justify-center text-center p-2">
                                    <span className="text-brand-cream/60 text-[10px] uppercase font-bold">Premium Quality Cards & Board</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <h1 className="text-4xl md:text-5xl font-black text-brand-gold mb-4 leading-tight">
                                PesaMali: The Physical Board Game
                            </h1>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex text-brand-gold">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-brand-cream/60 text-sm">(50+ verified orders across schools)</span>
                            </div>

                            <div className="bg-brand-olive/20 p-6 rounded-3xl border border-brand-olive/30 mb-8 backdrop-blur-md">
                                <p className="text-brand-cream/90 text-lg leading-relaxed mb-6">
                                    Bring the thrill of financial strategy to your classroom, home, or community. The physical edition of PesaMali is designed for 2-6 players to dive deep into wealth creation, debt management, and investment strategy.
                                </p>

                                <ul className="space-y-4">
                                    <li className="flex items-start gap-4">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-brand-green flex items-center justify-center">
                                            <CheckCircle size={14} className="text-brand-gold" />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-brand-cream">High-Durability Assets Cards</span>
                                            <span className="text-sm text-brand-cream/60">Premium finish resistant to wear and tear.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-brand-green flex items-center justify-center">
                                            <Users size={14} className="text-brand-gold" />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-brand-cream">Multiplayer Focus</span>
                                            <span className="text-sm text-brand-cream/60">Optimized for groups of 2 to 6 players.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-brand-green flex items-center justify-center">
                                            <GraduationCap size={14} className="text-brand-gold" />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-brand-cream">Educational Curriculum</span>
                                            <span className="text-sm text-brand-cream/60">Perfect for secondary school and university financial literacy clubs.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-grow flex items-center justify-center gap-3 bg-brand-gold hover:bg-brand-gold-light text-brand-dark text-xl font-black py-5 px-8 rounded-full transition-all transform hover:scale-[1.02] shadow-[0_0_30px_rgba(212,168,67,0.3)] group"
                                >
                                    <ShoppingBag size={24} className="group-hover:rotate-12 transition-transform" />
                                    BUY NOW / INQUIRE
                                </a>

                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-5 px-10 rounded-full transition-all"
                                >
                                    <MessageCircle size={24} />
                                    WhatsApp
                                </a>
                            </div>

                            <p className="mt-4 text-center text-brand-cream/40 text-xs uppercase tracking-tighter">
                                * Shipping available across Kenya. Educational discounts for schools are available.
                            </p>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-brand-dark/50 p-8 rounded-3xl border border-brand-olive/20 text-center">
                            <div className="w-16 h-16 bg-brand-olive/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Package className="text-brand-gold" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Complete Kit</h3>
                            <p className="text-brand-cream/60 text-sm">Includes tokens, dice, asset cards, and the premium game board.</p>
                        </div>
                        <div className="bg-brand-dark/50 p-8 rounded-3xl border border-brand-olive/20 text-center">
                            <div className="w-16 h-16 bg-brand-green/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Users className="text-brand-gold" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Interactive Learning</h3>
                            <p className="text-brand-cream/60 text-sm">Foster real discussions about credit, savings, and ROI.</p>
                        </div>
                        <div className="bg-brand-dark/50 p-8 rounded-3xl border border-brand-olive/20 text-center">
                            <div className="w-16 h-16 bg-brand-red/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <GraduationCap className="text-brand-gold" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Skill Building</h3>
                            <p className="text-brand-cream/60 text-sm">Develop decision-making skills that last a lifetime.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <FloatingWhatsAppButton />
        </div>
    );
}
