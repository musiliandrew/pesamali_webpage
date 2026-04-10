import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import HowToPlaySection from "@/components/HowToPlaySection";
import TournamentsSection from "@/components/TournamentsSection";
import WhatsAppSection from "@/components/WhatsAppSection";
import DownloadSection from "@/components/DownloadSection";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <HowToPlaySection />
        <TournamentsSection />
        <WhatsAppSection />
        <DownloadSection />
      </main>
      <FloatingWhatsAppButton />
      <Footer />
    </>
  );
}
