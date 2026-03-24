import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PesaMali — The Game of Money",
  description:
    "Master your money through play. PesaMali is a fun, competitive board game that teaches financial literacy through real-life scenarios. Available on Android & iOS.",
  keywords: ["PesaMali", "financial literacy", "board game", "money game", "Kenya", "Africa"],
  openGraph: {
    title: "PesaMali — The Game of Money",
    description: "Master your money through play.",
    images: ["/theone_to_be_used_in_hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
