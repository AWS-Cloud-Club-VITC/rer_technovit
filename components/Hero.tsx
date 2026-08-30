"use client";

import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Cpu } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden border-b border-[var(--border)] transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[var(--accent)]/08 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--foreground-muted)] mb-8 shadow-sm hover:border-[var(--accent-border)] hover:bg-[var(--surface-secondary)] transition-all">
            <span className="w-2 h-2 rounded-full bg-[var(--status-ready-dot)] animate-pulse" />
            <span className="text-[var(--foreground)] font-semibold tracking-wider">OFFICIAL COMPETITION PORTAL</span>
            <span className="text-[var(--border-hover)]">|</span>
            <span className="text-[var(--accent-text)] font-semibold">TECHNOVIT 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.08] max-w-4xl">
            REVERSE ENGINEERING{" "}
            <span className="text-[var(--accent-text)]">
              ROULETTE
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-6 text-xl sm:text-2xl font-mono text-[var(--foreground-muted)] tracking-wide max-w-2xl">
            &ldquo;<span className="text-[var(--foreground)] font-medium">{EVENT_CONFIG.tagline}</span>&rdquo;
          </p>

          {/* Event Metadata Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full">
            <div className="cyber-card rounded-xl p-3 sm:px-4 sm:py-3 flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-surface)] border border-[var(--accent-border)] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-[var(--accent-text)]" />
              </div>
              <div className="text-left font-mono text-xs sm:text-sm">
                <div className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider">Date</div>
                <div className="font-semibold text-[var(--foreground)]">{EVENT_CONFIG.date}</div>
              </div>
            </div>

            <div className="cyber-card rounded-xl p-3 sm:px-4 sm:py-3 flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-surface)] border border-[var(--accent-border)] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[var(--accent-text)]" />
              </div>
              <div className="text-left font-mono text-xs sm:text-sm">
                <div className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider">Venue</div>
                <div className="font-semibold text-[var(--foreground)]">{EVENT_CONFIG.venue}</div>
              </div>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/portal"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm sm:text-base tracking-wider transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span>ENTER TEAM PORTAL</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#rounds"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface-secondary)] text-[var(--foreground)] font-semibold text-sm sm:text-base transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <Cpu className="w-4 h-4 text-[var(--accent-text)]" />
              <span>Explore Rounds</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
