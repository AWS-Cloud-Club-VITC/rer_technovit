"use client";

import { useEffect, useState, useCallback } from "react";
import { Shield, GitBranch, Link as LinkIcon, CheckCircle2, LogOut, RefreshCw, Layers } from "lucide-react";
import MemberList from "./MemberList";
import SubmissionForm from "./SubmissionForm";
import SubmissionHistory, { SubmissionItem } from "./SubmissionHistory";
import type { TeamMember } from "@/lib/mongodb";
import { EVENT_CONFIG } from "@/lib/config";

interface TeamData {
  teamId: string;
  teamName: string;
  members: TeamMember[];
  createdAt?: string;
}

interface TeamDashboardProps {
  team: TeamData;
  onLogout: () => void;
}

export default function TeamDashboard({ team, onLogout }: TeamDashboardProps) {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [latestByRound, setLatestByRound] = useState<Record<number, SubmissionItem | null>>({
    1: null,
    2: null,
  });
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    setIsLoadingSubmissions(true);
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissions(data.submissions || []);
        if (data.latestByRound) {
          setLatestByRound(data.latestByRound);
        }
      }
    } catch {
      // Ignore network failure or show cached
    } finally {
      setIsLoadingSubmissions(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch("/api/submissions");
        const data = await res.json();
        if (isMounted && res.ok && data.success) {
          setSubmissions(data.submissions || []);
          if (data.latestByRound) {
            setLatestByRound(data.latestByRound);
          }
        }
      } catch {
        // Ignore network failure
      } finally {
        if (isMounted) {
          setIsLoadingSubmissions(false);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const completedRoundsCount = [1, 2].filter((r) => Boolean(latestByRound[r])).length;

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* Team Top Banner */}
      <div className="cyber-card rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[var(--surface)] via-[var(--surface-secondary)] to-[var(--surface)] border border-[var(--border)] shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[var(--accent)]/08 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-surface)] border border-[var(--accent-border)] flex items-center justify-center shadow-sm shrink-0">
              <Shield className="w-7 h-7 text-[var(--accent-text)]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-[var(--accent-text)] tracking-wider uppercase font-semibold">
                  TEAM PORTAL
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-ready-dot)]" />
                <span className="text-[11px] font-mono text-[var(--status-ready-text)] font-medium">AUTHENTICATED</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight mt-0.5">
                {team.teamName}
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={fetchSubmissions}
              disabled={isLoadingSubmissions}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] shadow-2xs"
              title="Refresh submissions"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSubmissions ? "animate-spin text-[var(--accent-text)]" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--status-error-border)] hover:bg-[var(--status-error-bg)] text-xs font-mono text-[var(--status-error-text)] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] shadow-2xs">
            <div className="text-[11px] font-mono text-[var(--foreground-muted)]">Roster Size</div>
            <div className="text-lg font-bold font-mono text-[var(--foreground)] mt-0.5">
              {team.members.length} {team.members.length === 1 ? "Member" : "Members"}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] shadow-2xs">
            <div className="text-[11px] font-mono text-[var(--foreground-muted)]">Rounds Completed</div>
            <div className="text-lg font-bold font-mono text-[var(--accent-text)] mt-0.5">
              {completedRoundsCount} / 2 Rounds
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] shadow-2xs">
            <div className="text-[11px] font-mono text-[var(--foreground-muted)]">Total Submissions</div>
            <div className="text-lg font-bold font-mono text-[var(--foreground)] mt-0.5">
              {submissions.length} Revisions
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] shadow-2xs">
            <div className="text-[11px] font-mono text-[var(--foreground-muted)]">Portal Status</div>
            <div className="text-lg font-bold font-mono text-[var(--status-ready-text)] mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--status-ready-text)]" />
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Round Submissions Active Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--foreground-muted)] font-semibold uppercase tracking-wider">
          <Layers className="w-4 h-4 text-[var(--accent-text)]" />
          <span>Active Submissions for Evaluation (2 Rounds)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EVENT_CONFIG.rounds.map((round) => {
            const sub = latestByRound[round.number];
            return (
              <div
                key={round.number}
                className={`cyber-card rounded-2xl p-5 border-t-4 transition-all flex flex-col justify-between ${
                  sub
                    ? "border-t-[var(--accent)] bg-[var(--surface)]"
                    : "border-t-[var(--border)] bg-[var(--surface-secondary)]/50 opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[var(--accent-text)]">
                        ROUND {round.number}
                      </span>
                      {round.submissionOpen ? (
                        <span className="text-[10px] font-mono text-[var(--status-ready-text)] bg-[var(--status-ready-bg)] px-2 py-0.5 rounded-full border border-[var(--status-ready-border)] font-semibold">
                          Open
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--status-error-text)] bg-[var(--status-error-bg)] px-2 py-0.5 rounded-full border border-[var(--status-error-border)] font-semibold">
                          Closed
                        </span>
                      )}
                    </div>
                    {sub ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--status-ready-text)] font-semibold bg-[var(--status-ready-bg)] px-2 py-0.5 rounded-full border border-[var(--status-ready-border)]">
                        <CheckCircle2 className="w-3 h-3" /> Submitted
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[var(--foreground-muted)] bg-[var(--surface-secondary)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                        Not Submitted
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-[var(--foreground)]">{round.name}</h4>
                  <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5 line-clamp-2">
                    {round.focus}
                  </p>

                  {sub && (
                    <div className="mt-3 text-[10px] font-mono text-[var(--foreground-muted)]">
                      Uploaded: {new Date(sub.submittedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border)] flex flex-col gap-2">
                  {sub ? (
                    <>
                      <a
                        href={sub.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] hover:border-[var(--accent)] text-xs font-mono text-[var(--foreground)] transition-colors truncate"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <GitBranch className="w-3.5 h-3.5 text-[var(--accent-text)] shrink-0" />
                          <span className="truncate">GitHub Repo</span>
                        </span>
                        <span className="text-[10px] text-[var(--accent-text)] font-bold font-mono">→</span>
                      </a>

                      <a
                        href={sub.demoVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] hover:border-[var(--accent)] text-xs font-mono text-[var(--foreground)] transition-colors truncate"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <LinkIcon className="w-3.5 h-3.5 text-[var(--status-ready-text)] shrink-0" />
                          <span className="truncate">Drive Video</span>
                        </span>
                        <span className="text-[10px] text-[var(--status-ready-text)] font-bold font-mono">→</span>
                      </a>
                    </>
                  ) : (
                    <div className="text-center py-2 text-xs font-mono text-[var(--foreground-muted)]">
                      Submission pending
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registered Members Roster (Read-Only) */}
      <MemberList members={team.members} />

      {/* New Project Submission Form (Supports 3 Rounds) */}
      <SubmissionForm onSuccess={fetchSubmissions} latestByRound={latestByRound} />

      {/* Submission History Log */}
      <SubmissionHistory submissions={submissions} isLoading={isLoadingSubmissions} />
    </div>
  );
}

