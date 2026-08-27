import { Eye, Compass, Brain, Code, CheckCircle2 } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

const FLOW_STEPS = [
  {
    step: 1,
    title: "Observe",
    icon: Eye,
    description: "Analyze the target application interface, layouts, visual components, and typography hierarchy under time constraints.",
  },
  {
    step: 2,
    title: "Explore",
    icon: Compass,
    description: "Interact with the system mechanics, uncover edge cases, state behaviors, animations, and functional workflows.",
  },
  {
    step: 3,
    title: "Remember",
    icon: Brain,
    description: "Retain critical details, logic flows, responsive behavior, and roulette twists once the source reference is hidden.",
  },
  {
    step: 4,
    title: "Reconstruct",
    icon: Code,
    description: "Engineer the solution from scratch with clean code, robust structure, faithful aesthetics, and matching logic.",
  },
  {
    step: 5,
    title: "Evaluate",
    icon: CheckCircle2,
    description: "Submit repository links and architectural documentation for multi-dimensional evaluation and automated checks.",
  },
];

export default function EventInfo() {
  return (
    <section id="about" className="py-16 sm:py-24 border-b border-[#343B47]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1C222C] border border-[#343B47] text-xs font-mono text-[#A855F7] mb-3">
            <span>[ SYSTEM CONCEPT ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight">
            How The Competition Works
          </h2>
          <p className="mt-4 text-[#A7AFBC] text-sm sm:text-base leading-relaxed">
            {EVENT_CONFIG.name} is a high-stakes technical competition designed to test your team&apos;s
            observation, memory, UI/UX precision, coding speed, problem-solving adaptability, and teamwork.
          </p>
        </div>

        {/* 5-Step Event Flow */}
        <div id="flow" className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#F5F5F5] flex items-center gap-2">
              <span className="text-[#A855F7]">{"///"}</span> Core Event Flow
            </h3>
            <span className="text-xs font-mono text-[#A7AFBC]">5-PHASE LIFECYCLE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {FLOW_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="cyber-card rounded-xl p-5 flex flex-col justify-between relative group hover:border-[#A855F7]/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-[#343B47] group-hover:text-[#A855F7]/40 transition-colors">
                      0{item.step}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#151A23] border border-[#343B47] flex items-center justify-center group-hover:border-[#A855F7] transition-colors">
                      <Icon className="w-4 h-4 text-[#A855F7]" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-[#F5F5F5] mb-2 tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#A7AFBC] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#343B47]/40 flex items-center justify-between text-[11px] font-mono text-[#A7AFBC]">
                    <span>PHASE 0{item.step}</span>
                    <span className="text-[#22C55E]">READY</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
