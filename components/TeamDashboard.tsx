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
    <div className="space-y-8">
      {/* Team Top Banner */}
      <div className="cyber-card rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#1C222C] via-[#1C222C] to-[#251B38] border border-[#343B47] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#A855F7]/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#151A23] border border-[#A855F7]/40 flex items-center justify-center glow-purple shrink-0">
              <Shield className="w-7 h-7 text-[#A855F7]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-[#A855F7] tracking-wider uppercase">
                  TEAM PORTAL
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span className="text-[11px] font-mono text-[#22C55E]">AUTHENTICATED</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] tracking-tight mt-0.5">
                {team.teamName}
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={fetchSubmissions}
              disabled={isLoadingSubmissions}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#151A23] border border-[#343B47] text-xs font-mono text-[#A7AFBC] hover:text-[#F5F5F5] hover:border-[#A855F7] transition-all disabled:opacity-50"
              title="Refresh submissions"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSubmissions ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#151A23] border border-[#EF4444]/40 hover:bg-[#EF4444]/10 text-xs font-mono text-[#EF4444] transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 pt-6 border-t border-[#343B47]/60 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-[#151A23]/60 border border-[#343B47]/60">
            <div className="text-[11px] font-mono text-[#A7AFBC]">Roster Size</div>
            <div className="text-lg font-bold font-mono text-[#F5F5F5] mt-0.5">
              {team.members.length} {team.members.length === 1 ? "Member" : "Members"}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#151A23]/60 border border-[#343B47]/60">
            <div className="text-[11px] font-mono text-[#A7AFBC]">Total Submissions</div>
            <div className="text-lg font-bold font-mono text-[#B45CFF] mt-0.5">
              {submissions.length} Revisions
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#151A23]/60 border border-[#343B47]/60">
            <div className="text-[11px] font-mono text-[#A7AFBC]">Active Evaluation Revision</div>
            <div className="text-lg font-bold font-mono text-[#22C55E] mt-0.5">
              {latestSub ? `Submission #${latestSub.submissionNumber}` : "None"}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#151A23]/60 border border-[#343B47]/60">
            <div className="text-[11px] font-mono text-[#A7AFBC]">Portal Status</div>
            <div className="text-lg font-bold font-mono text-[#22C55E] mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Submission Spotlight Card (if any) */}
      {latestSub && (
        <div className="cyber-card rounded-xl p-5 sm:p-6 border-l-4 border-l-[#A855F7] bg-[#1C222C]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#A855F7] mb-1">
                <span>ACTIVE SUBMISSION FOR JUDGES</span>
                <span>•</span>
                <span className="text-[#22C55E]">VALID</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#F5F5F5]">
                Submission #{latestSub.submissionNumber}
              </h3>
              <p className="text-xs text-[#A7AFBC] mt-0.5">
                Uploaded: {new Date(latestSub.submittedAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={latestSub.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#151A23] border border-[#343B47] hover:border-[#A855F7] text-xs font-mono text-[#F5F5F5] transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>View GitHub Repo</span>
              </a>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#151A23] border border-[#343B47] text-xs font-mono text-[#A7AFBC]">
                <FileText className="w-3.5 h-3.5 text-[#22C55E]" />
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
