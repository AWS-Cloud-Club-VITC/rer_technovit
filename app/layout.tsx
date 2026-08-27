import type { Metadata, Viewport } from "next";
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
  title: "Reverse Engineering Roulette | See it. Remember it. Reverse it.",
  description:
    "Official technical portal for Reverse Engineering Roulette — A three-round technical competition based on observation, memory, UI/UX, coding, problem-solving, adaptability, and teamwork.",
  keywords: ["Reverse Engineering Roulette", "RER", "Hackathon", "Coding Competition", "Technovit 2026"],
  authors: [{ name: "RER Technical Committee" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#151A23",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full`}>
      <body className="cyber-grid-bg min-h-full flex flex-col antialiased text-[#F5F5F5] selection:bg-[#A855F7]/30 selection:text-[#F5F5F5]">
        {children}
      </body>
    </html>
  );
}
