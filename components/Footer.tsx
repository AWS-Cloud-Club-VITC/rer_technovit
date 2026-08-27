import Link from "next/link";
import { Terminal, Calendar, MapPin } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#343B47] bg-[#151A23] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#1C222C] border border-[#343B47] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-[#A855F7]" />
              </div>
              <span className="font-bold text-sm tracking-wider text-[#F5F5F5]">
                {EVENT_CONFIG.name}
              </span>
            </div>
            <p className="mt-2 text-xs font-mono text-[#A7AFBC]">
              &ldquo;{EVENT_CONFIG.tagline}&rdquo;
            </p>
          </div>

          {/* Event Details */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#A7AFBC]">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>{EVENT_CONFIG.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>{EVENT_CONFIG.venue}</span>
            </div>
          </div>

          {/* Action Link */}
          <div>
            <Link
              href="/portal"
              className="text-xs font-mono text-[#A855F7] hover:text-[#B45CFF] underline underline-offset-4 transition-colors"
            >
              Access Team Portal →
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#343B47]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#A7AFBC]/60">
          <span>Reverse Engineering Roulette Technical Portal</span>
          <span>Observing • Exploring • Remembering • Reconstructing</span>
        </div>
      </div>
    </footer>
  );
}
