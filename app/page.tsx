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
        <section className="py-20 border-b border-[#343B47]/60 relative overflow-hidden bg-gradient-to-b from-transparent to-[#1C222C]/40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#A855F7]/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1C222C] border border-[#343B47] text-xs font-mono text-[#A855F7] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>READY FOR THE CHALLENGE?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F5F5] tracking-tight max-w-2xl mx-auto">
              Ready to Reverse Engineer the System?
            </h2>

            <p className="mt-4 text-base text-[#A7AFBC] max-w-xl mx-auto font-mono">
              Register your team or access your portal to upload submissions for {EVENT_CONFIG.name}.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/portal"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#9333EA] hover:from-[#B45CFF] hover:to-[#A855F7] text-[#151A23] font-bold text-sm tracking-wider transition-all shadow-lg hover:shadow-[#A855F7]/30 group"
              >
                <Terminal className="w-4 h-4" />
                <span>ACCESS TEAM PORTAL</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/portal"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-[#1C222C] border border-[#343B47] hover:border-[#A855F7]/60 text-[#F5F5F5] font-medium text-sm transition-colors"
              >
                <Shield className="w-4 h-4 text-[#A855F7]" />
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
