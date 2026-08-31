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
    isSpecial: true,
    criteria: [
      "Dynamic User Interactions & State Handlers",
      "Responsive Breakpoint Behavior",
      "Form Validations & Feedback Mechanics",
      "Clean Architectural Modularization",
    ],
  },
];

export default function Rounds() {
  return (
    <section id="rounds" className="py-16 sm:py-24 border-b border-[var(--border)] relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--accent-surface)] border border-[var(--accent-border)] text-xs font-mono text-[var(--accent-text)] mb-3 shadow-sm font-semibold">
            <span>[ COMPETITION STRUCTURE ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
            The Two Rounds
          </h2>
          <p className="mt-4 text-[var(--foreground-muted)] text-sm sm:text-base leading-relaxed">
            Progression through each round demands deep observation, sharp technical execution, and agility under pressure.
          </p>
        </div>

        {/* Rounds Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ROUND_DETAILS.map((round) => {
            const Icon = round.icon;
            return (
              <div
                key={round.number}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative group transition-all duration-300 ${
                  round.isSpecial
                    ? "cyber-card-roulette"
                    : "cyber-card"
                }`}
              >
                {/* Round Header */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wider bg-[var(--accent-surface)] border border-[var(--accent-border)] text-[var(--accent-text)]">
                      {round.tag}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-surface)] border border-[var(--accent-border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
                      <Icon className="w-5 h-5 text-[var(--accent-text)] group-hover:text-[var(--accent-hover)] transition-colors" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-[var(--accent-text)] font-bold">ROUND 0{round.number}</span>
                    {round.isSpecial && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent-surface)] border border-[var(--accent-border)] text-[var(--accent-text)] font-semibold">
                        FLAGSHIP
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-[var(--foreground)] tracking-wide mb-3 group-hover:text-[var(--accent-text)] transition-colors">
                    {round.name}
                  </h3>

                  <div className="mb-4 inline-flex items-center gap-1.5 text-xs font-mono text-[var(--status-ready-text)] bg-[var(--status-ready-bg)] px-2.5 py-1 rounded-md border border-[var(--status-ready-border)] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-ready-dot)]" />
                    <span>Focus: {round.focus}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed mb-6">
                    {round.description}
                  </p>
                </div>

                {/* Key Criteria Checklist */}
                <div className="pt-5 border-t border-[var(--border-subtle)]">
                  <h4 className="text-xs font-mono font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3.5 flex items-center gap-2">
                    <span className="text-[var(--accent-text)]">▸</span> Evaluation Keypoints:
                  </h4>
                  <ul className="space-y-2.5">
                    {round.criteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">
                        <CheckCircle className="w-3.5 h-3.5 text-[var(--accent-text)] shrink-0 mt-0.5" />
                        <span className="leading-snug">{c}</span>
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
