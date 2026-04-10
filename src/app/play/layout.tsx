import type { Metadata, Viewport } from "next";
import PwaClient from "@/components/play/PwaClient";

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  applicationName: "PesaMali",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PesaMali",
  },
};

export const viewport: Viewport = {
  themeColor: "#2D5016",
};

export default function PlayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <PwaClient />
    </>
  );
}
