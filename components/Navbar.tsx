"use client";

import Link from "next/link";
import { Terminal, Shield, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  teamName?: string;
  onLogout?: () => void;
}

export default function Navbar({ isAuthenticated, teamName, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#343B47] bg-[#151A23]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[#1C222C] border border-[#343B47] flex items-center justify-center group-hover:border-[#A855F7] transition-colors shadow-sm">
            <Terminal className="w-5 h-5 text-[#A855F7] group-hover:text-[#B45CFF] transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-wider text-sm sm:text-base text-[#F5F5F5] group-hover:text-[#B45CFF] transition-colors">
              RER <span className="text-[#A855F7]">2026</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#A7AFBC]">
              Reverse Engineering Roulette
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#A7AFBC]">
          <Link href="/#about" className="hover:text-[#F5F5F5] transition-colors">
            Concept
          </Link>
          <Link href="/#event-flow" className="hover:text-[#F5F5F5] transition-colors">
            Event Flow
          </Link>
          <Link href="/#rounds" className="hover:text-[#F5F5F5] transition-colors">
            Three Rounds
          </Link>
          <Link href="/#rules" className="hover:text-[#F5F5F5] transition-colors">
            Rules & Scoring
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/portal"
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#1C222C] border border-[#343B47] text-xs font-mono text-[#F5F5F5] hover:border-[#A855F7] transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>{teamName || "Team Portal"}</span>
              </Link>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs rounded-md bg-[#1C222C] border border-[#343B47] text-[#A7AFBC] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A855F7] hover:bg-[#B45CFF] text-[#151A23] font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md hover:shadow-[#A855F7]/25"
            >
              <span>ENTER PORTAL</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
