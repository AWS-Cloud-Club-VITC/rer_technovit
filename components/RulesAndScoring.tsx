import { ShieldAlert, Award, FileCheck2, GitBranch, AlertTriangle, ShieldCheck } from "lucide-react";

export default function RulesAndScoring() {
  return (
    <section id="rules" className="py-16 sm:py-24 border-b border-[var(--border)] relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--accent-surface)] border border-[var(--accent-border)] text-xs font-mono text-[var(--accent-text)] mb-3 shadow-sm font-semibold">
            <span>[ GUIDELINES & EVALUATION ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
            Rules & Scoring System
          </h2>
          <p className="mt-4 text-[var(--foreground-muted)] text-sm sm:text-base leading-relaxed">
            Adherence to technical competition protocols is mandatory for all registered teams.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rules Card */}
          <div className="cyber-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-surface)] border border-[var(--accent-border)] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-[var(--accent-text)]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">Competition Protocols</h3>
                  <span className="text-xs font-mono text-[var(--foreground-muted)]">OPERATIONAL GUIDELINES</span>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-[var(--foreground-muted)]">
                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)]">
                  <div className="w-6 h-6 rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center justify-center font-mono text-xs text-[var(--accent-text)] shrink-0 font-bold">
                    01
                  </div>
                  <div className="leading-relaxed">
                    <strong className="text-[var(--foreground)]">Registered Team Members:</strong> Team member details are locked upon initial registration and cannot be modified later.
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)]">
                  <div className="w-6 h-6 rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center justify-center font-mono text-xs text-[var(--accent-text)] shrink-0 font-bold">
                    02
                  </div>
                  <div className="leading-relaxed">
                    <strong className="text-[var(--foreground)]">Submission Versioning:</strong> Teams may submit multiple revisions. However, <span className="text-[var(--accent-text)] font-semibold">only the latest submission</span> is considered valid for judging.
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)]">
                  <div className="w-6 h-6 rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center justify-center font-mono text-xs text-[var(--accent-text)] shrink-0 font-bold">
                    03
                  </div>
                  <div className="leading-relaxed">
                    <strong className="text-[var(--foreground)]">2-Round Submissions:</strong> Submissions are divided into 2 rounds (Round 1: Visual Recall and Round 2: Functionality Hunt). Each round requires a valid GitHub repository URL and a Google Drive video link.
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)]">
                  <div className="w-6 h-6 rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center justify-center font-mono text-xs text-[var(--accent-text)] shrink-0 font-bold">
                    04
                  </div>
                  <div className="leading-relaxed">
                    <strong className="text-[var(--foreground)]">Authentic Engineering:</strong> All code must be authored by the registered team. Plagiarism or unauthorized external code injection results in disqualification.
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-2 text-xs font-mono text-[var(--status-ready-text)] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Strict compliance verified by technical committee</span>
            </div>
          </div>

          {/* Scoring Card */}
          <div className="cyber-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--status-ready-bg)] border border-[var(--status-ready-border)] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[var(--status-ready-text)]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">Scoring Matrices</h3>
                  <span className="text-xs font-mono text-[var(--foreground-muted)]">EVALUATION CRITERIA WEIGHTS</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-between hover:border-[var(--accent)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-2xs">
                      <FileCheck2 className="w-4 h-4 text-[var(--accent-text)]" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[var(--foreground)] block">Visual & Design Accuracy</span>
                      <span className="text-[11px] text-[var(--foreground-muted)]">Layout fidelity, color hierarchy & typography</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[var(--accent-text)] font-bold px-2.5 py-1 rounded-md bg-[var(--accent-surface)] border border-[var(--accent-border)]">
                    Round 1 Focus
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-between hover:border-[var(--status-ready-dot)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-2xs">
                      <GitBranch className="w-4 h-4 text-[var(--status-ready-text)]" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[var(--foreground)] block">Functional Mechanics & Code Structure</span>
                      <span className="text-[11px] text-[var(--foreground-muted)]">State handling, responsiveness & modularity</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[var(--status-ready-text)] font-bold px-2.5 py-1 rounded-md bg-[var(--status-ready-bg)] border border-[var(--status-ready-border)]">
                    Round 2 Focus
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-xs font-mono text-[var(--foreground-muted)]">
              Evaluation weighs accuracy, logic completeness, responsiveness, and promptness.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
