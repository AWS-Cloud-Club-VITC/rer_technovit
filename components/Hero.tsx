"use client";

import Link from "next/link";
import { Calendar, MapPin, ArrowRight, ShieldCheck, Cpu, Code2, Sparkles } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden border-b border-[#343B47]/60">
      {/* Background glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#A855F7]/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1C222C] border border-[#343B47] text-xs font-mono text-[#A7AFBC] mb-8 shadow-inner hover:border-[#A855F7]/50 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[#F5F5F5] font-semibold tracking-wider">OFFICIAL COMPETITION PORTAL</span>
            <span className="text-[#343B47]">|</span>
            <span className="text-[#B45CFF]">TECHNOVIT 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F5F5] leading-tight sm:leading-none max-w-4xl">
            REVERSE ENGINEERING{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#B45CFF] to-[#7C3AED] glow-text-purple">
              ROULETTE
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-6 text-xl sm:text-2xl font-mono text-[#A7AFBC] tracking-wide max-w-2xl">
            &ldquo;<span className="text-[#F5F5F5] font-medium">{EVENT_CONFIG.tagline}</span>&rdquo;
          </p>

          {/* Event Metadata Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full">
            <div className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg bg-[#1C222C]/80 border border-[#343B47] text-xs sm:text-sm font-mono text-[#F5F5F5]">
              <Calendar className="w-4 h-4 text-[#A855F7]" />
              <span className="text-[#A7AFBC]">Date:</span>
              <span className="font-semibold text-[#F5F5F5]">{EVENT_CONFIG.date}</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg bg-[#1C222C]/80 border border-[#343B47] text-xs sm:text-sm font-mono text-[#F5F5F5]">
              <MapPin className="w-4 h-4 text-[#A855F7]" />
              <span className="text-[#A7AFBC]">Venue:</span>
              <span className="font-semibold text-[#F5F5F5]">{EVENT_CONFIG.venue}</span>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/portal"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#9333EA] hover:from-[#B45CFF] hover:to-[#A855F7] text-[#151A23] font-bold text-sm sm:text-base tracking-wider transition-all shadow-lg hover:shadow-[#A855F7]/30 group"
            >
              <span>ENTER TEAM PORTAL</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#rounds"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-[#1C222C] border border-[#343B47] hover:border-[#A855F7]/60 text-[#F5F5F5] font-medium text-sm sm:text-base transition-colors"
            >
              <Cpu className="w-4 h-4 text-[#A855F7]" />
              <span>Explore Rounds</span>
            </a>
          </div>

          {/* Technical Badges Banner */}
          <div className="mt-14 pt-8 border-t border-[#343B47]/50 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#A7AFBC]">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              <span>Team Auth Portal</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#A7AFBC]">
              <Code2 className="w-4 h-4 text-[#A855F7]" />
              <span>GitHub Repo Eval</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#A7AFBC]">
              <Sparkles className="w-4 h-4 text-[#B45CFF]" />
              <span>Versioned PDF Submissions</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#A7AFBC]">
              <Cpu className="w-4 h-4 text-[#22C55E]" />
              <span>Live Multi-Round</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
