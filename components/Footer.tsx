import Link from "next/link";
import { Terminal, Calendar, MapPin } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface-secondary)] py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center justify-center">
                <Terminal className="w-4 h-4 text-[var(--accent-text)]" />
              </div>
              <span className="font-extrabold text-sm tracking-wider text-[var(--foreground)]">
                {EVENT_CONFIG.name}
              </span>
            </div>
            <p className="mt-2 text-xs font-mono text-[var(--foreground-muted)]">
              &ldquo;{EVENT_CONFIG.tagline}&rdquo;
            </p>
          </div>

          {/* Event Details */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[var(--foreground-muted)]">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[var(--accent-text)]" />
              <span>{EVENT_CONFIG.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent-text)]" />
              <span>{EVENT_CONFIG.venue}</span>
            </div>
          </div>

          {/* Action Link */}
          <div>
            <Link
              href="/portal"
              className="text-xs font-mono text-[var(--accent-text)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors font-semibold"
            >
              Access Team Portal →
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[var(--foreground-subtle)]">
          <span>Reverse Engineering Roulette Technical Portal • Technovit 2026</span>
          <span>Observing • Exploring • Remembering • Reconstructing</span>
        </div>
      </div>
    </footer>
  );
}
