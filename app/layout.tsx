import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
  themeColor: "#0c0f17",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('rer_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="cyber-grid-bg min-h-full flex flex-col antialiased text-[var(--foreground)] selection:bg-[#7C3AED]/20 selection:text-[#7C3AED] dark:selection:bg-[#A855F7]/30 dark:selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
