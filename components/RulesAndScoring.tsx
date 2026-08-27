import { ShieldAlert, Award, FileCheck2, GitBranch, AlertTriangle } from "lucide-react";

export default function RulesAndScoring() {
  return (
    <section id="rules" className="py-16 sm:py-24 border-b border-[#343B47]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1C222C] border border-[#343B47] text-xs font-mono text-[#A855F7] mb-3">
            <span>[ GUIDELINES & EVALUATION ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight">
            Rules & Scoring System
          </h2>
          <p className="mt-4 text-[#A7AFBC] text-sm sm:text-base leading-relaxed">
            Adherence to technical competition protocols is mandatory for all registered teams.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rules Card */}
          <div className="cyber-card rounded-xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#151A23] border border-[#343B47] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-[#A855F7]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F5]">Competition Protocols</h3>
                <span className="text-xs font-mono text-[#A7AFBC]">OPERATIONAL GUIDELINES</span>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-[#A7AFBC]">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] mt-1.5 shrink-0" />
                <div>
                  <strong className="text-[#F5F5F5]">Registered Team Members:</strong> Team member details are locked upon initial registration and cannot be modified later.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] mt-1.5 shrink-0" />
                <div>
                  <strong className="text-[#F5F5F5]">Submission Versioning:</strong> Teams may submit multiple revisions. However, <span className="text-[#B45CFF] font-semibold">only the latest submission</span> is considered valid for judging.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] mt-1.5 shrink-0" />
                <div>
                  <strong className="text-[#F5F5F5]">Artifact Submissions:</strong> Every submission requires a valid PDF file (architectural/design summary) and a reachable GitHub repository URL.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] mt-1.5 shrink-0" />
                <div>
                  <strong className="text-[#F5F5F5]">Authentic Engineering:</strong> All code must be authored by the registered team. Plagiarism or unauthorized external code injection results in disqualification.
                </div>
              </li>
            </ul>
          </div>

          {/* Scoring Card */}
          <div className="cyber-card rounded-xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#151A23] border border-[#343B47] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F5]">Scoring Matrices</h3>
                <span className="text-xs font-mono text-[#A7AFBC]">EVALUATION CRITERIA WEIGHTS</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-[#151A23] border border-[#343B47] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="w-4 h-4 text-[#A855F7]" />
                  <span className="text-xs sm:text-sm font-medium text-[#F5F5F5]">Visual & Design Accuracy</span>
                </div>
                <span className="text-xs font-mono text-[#B45CFF] font-bold">Round 1 Focus</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#151A23] border border-[#343B47] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-xs sm:text-sm font-medium text-[#F5F5F5]">Functional Mechanics & Code Structure</span>
                </div>
                <span className="text-xs font-mono text-[#22C55E] font-bold">Round 2 Focus</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#151A23] border border-[#343B47] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                  <span className="text-xs sm:text-sm font-medium text-[#F5F5F5]">Roulette Challenge Adaptation</span>
                </div>
                <span className="text-xs font-mono text-[#EF4444] font-bold">Round 3 Focus</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#343B47]/60 text-xs font-mono text-[#A7AFBC]">
              Evaluation evaluates accuracy, logic completeness, responsiveness, and promptness.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
