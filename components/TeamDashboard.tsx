"use client";

import { useEffect, useState, useCallback } from "react";
import { Shield, GitBranch, FileText, CheckCircle2, LogOut, RefreshCw } from "lucide-react";
import MemberList from "./MemberList";
import SubmissionForm from "./SubmissionForm";
import SubmissionHistory, { SubmissionItem } from "./SubmissionHistory";
import type { TeamMember } from "@/lib/mongodb";

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
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    setIsLoadingSubmissions(true);
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissions(data.submissions || []);
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

  const latestSub = submissions[0] || null;

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
            <div className="text-[11px] font-mono text-[var(--foreground-muted)]">Total Submissions</div>
            <div className="text-lg font-bold font-mono text-[var(--accent-text)] mt-0.5">
              {submissions.length} Revisions
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] shadow-2xs">
            <div className="text-[11px] font-mono text-[var(--foreground-muted)]">Active Revision</div>
            <div className="text-lg font-bold font-mono text-[var(--status-ready-text)] mt-0.5 truncate">
              {latestSub ? `Submission #${latestSub.submissionNumber}` : "None"}
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

      {/* Latest Submission Spotlight Card (if any) */}
      {latestSub && (
        <div className="cyber-card rounded-2xl p-5 sm:p-6 border-l-4 border-l-[var(--accent)] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-text)] mb-1 font-semibold">
                <span>ACTIVE SUBMISSION FOR JUDGES</span>
                <span>•</span>
                <span className="text-[var(--status-ready-text)]">VALID</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                Submission #{latestSub.submissionNumber}
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5 font-mono">
                Uploaded: {new Date(latestSub.submittedAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={latestSub.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] hover:border-[var(--accent)] text-xs font-mono text-[var(--foreground)] transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                <span>View GitHub Repo</span>
              </a>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-xs font-mono text-[var(--foreground-muted)]">
                <FileText className="w-3.5 h-3.5 text-[var(--status-ready-text)]" />
                <span className="truncate max-w-[150px]">{latestSub.pdfOriginalName}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registered Members Roster (Read-Only) */}
      <MemberList members={team.members} />

      {/* New Project Submission Form */}
      <SubmissionForm onSuccess={fetchSubmissions} />

      {/* Submission History Log */}
      <SubmissionHistory submissions={submissions} isLoading={isLoadingSubmissions} />
    </div>
  );
}
