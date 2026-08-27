import { Eye, Layers, Shuffle, CheckCircle } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

const ROUND_DETAILS = [
  {
    number: 1,
    name: EVENT_CONFIG.rounds[0].name,
    tag: "AESTHETICS & LAYOUT",
    icon: Eye,
    focus: EVENT_CONFIG.rounds[0].focus,
    description: EVENT_CONFIG.rounds[0].description,
    criteria: [
      "Layout & Visual Hierarchy Fidelity",
      "Color Palette & Typography Alignment",
      "Component Positioning & Spacing",
      "Visual Recall Accuracy Without Live Reference",
    ],
  },
  {
    number: 2,
    name: EVENT_CONFIG.rounds[1].name,
    tag: "INTERACTIONS & STATE",
    icon: Layers,
    focus: EVENT_CONFIG.rounds[1].focus,
    description: EVENT_CONFIG.rounds[1].description,
    criteria: [
      "Dynamic User Interactions & State Handlers",
      "Responsive Breakpoint Behavior",
      "Form Validations & Feedback Mechanics",
      "Clean Architectural Modularization",
    ],
  },
  {
    number: 3,
    name: EVENT_CONFIG.rounds[2].name,
    tag: "LIVE ADAPTATION",
    icon: Shuffle,
    focus: EVENT_CONFIG.rounds[2].focus,
    description: EVENT_CONFIG.rounds[2].description,
    criteria: [
      "Randomized Twist Implementation",
      "Speed Under Sudden Constraints",
      "Edge-Case Handling & Debugging",
      "Team Coordination & Problem Solving",
    ],
  },
];

export default function Rounds() {
  return (
    <section id="rounds" className="py-16 sm:py-24 border-b border-[#343B47]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1C222C] border border-[#343B47] text-xs font-mono text-[#A855F7] mb-3">
            <span>[ COMPETITION STRUCTURE ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight">
            The Three Rounds
          </h2>
          <p className="mt-4 text-[#A7AFBC] text-sm sm:text-base leading-relaxed">
            Progression through each round demands deep observation, sharp technical execution, and agility under pressure.
          </p>
        </div>

        {/* Rounds Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {ROUND_DETAILS.map((round) => {
            const Icon = round.icon;
            return (
              <div
                key={round.number}
                className="cyber-card rounded-xl p-6 flex flex-col justify-between relative group hover:border-[#A855F7]/60 transition-all"
              >
                {/* Round Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded text-[11px] font-mono tracking-wider bg-[#151A23] border border-[#343B47] text-[#B45CFF]">
                      {round.tag}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-[#151A23] border border-[#343B47] flex items-center justify-center group-hover:border-[#A855F7] transition-colors">
                      <Icon className="w-5 h-5 text-[#A855F7]" />
                    </div>
                  </div>

                  <div className="text-xs font-mono text-[#A855F7] mb-1">ROUND 0{round.number}</div>
                  <h3 className="text-2xl font-bold text-[#F5F5F5] tracking-wide mb-2">
                    {round.name}
                  </h3>

                  <div className="mb-4 inline-block text-xs font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
                    Focus: {round.focus}
                  </div>

                  <p className="text-xs sm:text-sm text-[#A7AFBC] leading-relaxed mb-6">
                    {round.description}
                  </p>
                </div>

                {/* Key Criteria Checklist */}
                <div className="pt-4 border-t border-[#343B47]/60">
                  <h4 className="text-xs font-mono font-semibold text-[#F5F5F5] uppercase tracking-wider mb-3">
                    Evaluation Keypoints:
                  </h4>
                  <ul className="space-y-2">
                    {round.criteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#A7AFBC]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#A855F7] shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
