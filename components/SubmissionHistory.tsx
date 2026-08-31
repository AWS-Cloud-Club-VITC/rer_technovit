"use client";

import { useState } from "react";
import { History, Link as LinkIcon, ExternalLink, CheckCircle, Clock, Filter } from "lucide-react";

export interface SubmissionItem {
  id: string;
  submissionNumber: number;
  roundNumber?: number;
  demoVideoUrl: string;
  githubUrl: string;
  submittedAt: string | Date;
  isLatest: boolean;
}

interface SubmissionHistoryProps {
  submissions: SubmissionItem[];
  isLoading?: boolean;
}

export default function SubmissionHistory({ submissions, isLoading }: SubmissionHistoryProps) {
  const [filterRound, setFilterRound] = useState<number>(0); // 0 = All

  const formatDate = (dateInput: string | Date) => {
    try {
      const d = new Date(dateInput);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return String(dateInput);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (filterRound === 0) return true;
    return (sub.roundNumber || 1) === filterRound;
  });

  return (
    <div className="cyber-card rounded-2xl p-6 sm:p-8 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-surface)] border border-[var(--accent-border)] flex items-center justify-center">
            <History className="w-5 h-5 text-[var(--accent-text)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Submission Version History</h3>
            <p className="text-xs text-[var(--foreground-muted)]">
              Complete immutable log of all project uploads across both rounds ({submissions.length} total)
            </p>
          </div>
        </div>

        {/* Round Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[var(--surface-secondary)] p-1 rounded-xl border border-[var(--border)] self-start md:self-auto">
          <span className="text-[11px] font-mono text-[var(--foreground-muted)] px-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[0, 1, 2].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFilterRound(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                filterRound === r
                  ? "bg-[var(--accent)] text-white shadow-2xs font-bold"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
              }`}
            >
              {r === 0 ? "All" : `R${r}`}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs font-mono text-[var(--foreground-muted)]">
          Loading submission logs...
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="py-12 text-center text-xs font-mono text-[var(--foreground-muted)] border border-dashed border-[var(--border)] rounded-xl mt-6 bg-[var(--surface-secondary)]">
          {submissions.length === 0
            ? "No submissions recorded yet. Use the form above to upload your project revision."
            : `No submissions recorded for Round ${filterRound}.`}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredSubmissions.map((sub, index) => {
            const isLatest = sub.isLatest;
            const roundNum = sub.roundNumber || 1;
            return (
              <div
                key={sub.id || index}
                className={`p-5 rounded-xl border transition-all ${
                  isLatest
                    ? "bg-[var(--accent-surface)] border-[var(--accent-border)] shadow-sm"
                    : "bg-[var(--surface-secondary)] border-[var(--border)] opacity-90 hover:opacity-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[var(--border)]">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-mono font-bold ${
                        isLatest
                          ? "bg-[var(--accent)] text-white shadow-2xs"
                          : "bg-[var(--surface)] text-[var(--foreground-muted)] border border-[var(--border)]"
                      }`}
                    >
                      SUBMISSION #{sub.submissionNumber}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-surface)] border border-[var(--accent-border)] text-[11px] font-mono text-[var(--accent-text)] font-semibold">
                      ROUND {roundNum}
                    </span>

                    {isLatest ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--status-ready-bg)] border border-[var(--status-ready-border)] text-[11px] font-mono text-[var(--status-ready-text)] font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>ROUND {roundNum} ACTIVE</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-[var(--foreground-subtle)]">
                        Archived Version
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--foreground-muted)]">
                    <Clock className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                    <span>{formatDate(sub.submittedAt)}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <LinkIcon className="w-4 h-4 text-[var(--accent-text)] shrink-0" />
                      <div className="truncate">
                        <div className="text-[10px] font-mono text-[var(--foreground-muted)]">Round {roundNum} Demo Video</div>
                        <div className="text-xs font-mono text-[var(--foreground)] truncate">
                          {sub.demoVideoUrl}
                        </div>
                      </div>
                    </div>
                    <a
                      href={sub.demoVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--accent)] text-[var(--foreground-muted)] hover:text-white transition-colors shrink-0"
                      title="Open Google Drive Video"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center justify-between">
                    <div className="truncate min-w-0 pr-2">
                      <div className="text-[10px] font-mono text-[var(--foreground-muted)]">Round {roundNum} Target Repository</div>
                      <div className="text-xs font-mono text-[var(--foreground)] truncate">
                        {sub.githubUrl}
                      </div>
                    </div>
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--accent)] text-[var(--foreground-muted)] hover:text-white transition-colors shrink-0"
                      title="Open GitHub Repository"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

