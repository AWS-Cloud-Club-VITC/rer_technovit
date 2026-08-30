import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventInfo from "@/components/EventInfo";
import Rounds from "@/components/Rounds";
import RulesAndScoring from "@/components/RulesAndScoring";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Terminal, Shield, Sparkles } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Concept & Event Flow */}
        <EventInfo />

        {/* The Three Rounds */}
        <Rounds />

        {/* Rules & Scoring */}
        <RulesAndScoring />

        {/* Bottom Call to Action Section */}
        <section className="py-20 sm:py-28 border-b border-[var(--border)] relative overflow-hidden bg-gradient-to-b from-transparent to-[var(--surface-secondary)]/80 transition-colors duration-200">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-[var(--accent)]/08 blur-[120px] pointer-events-none rounded-full" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--accent-text)] mb-5 shadow-sm font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>READY FOR THE CHALLENGE?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight max-w-2xl mx-auto">
              Ready to Reverse Engineer the System?
            </h2>

            <p className="mt-4 text-base text-[var(--foreground-muted)] max-w-xl mx-auto font-mono">
              Register your team or access your portal to upload submissions for {EVENT_CONFIG.name}.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/portal"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm tracking-wider transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
              >
                <Terminal className="w-4 h-4" />
                <span>ACCESS TEAM PORTAL</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/portal"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface-secondary)] text-[var(--foreground)] font-semibold text-sm transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <Shield className="w-4 h-4 text-[var(--accent-text)]" />
                <span>Existing Team Login</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
