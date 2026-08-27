import { History, FileText, ExternalLink, CheckCircle, Clock } from "lucide-react";

export interface SubmissionItem {
  id: string;
  submissionNumber: number;
  pdfStoragePath: string;
  pdfOriginalName: string;
  pdfSizeBytes: number;
  githubUrl: string;
  submittedAt: string | Date;
  isLatest: boolean;
}

interface SubmissionHistoryProps {
  submissions: SubmissionItem[];
  isLoading?: boolean;
}

export default function SubmissionHistory({ submissions, isLoading }: SubmissionHistoryProps) {
  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

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

  return (
    <div className="cyber-card rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#343B47]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#151A23] border border-[#343B47] flex items-center justify-center">
            <History className="w-5 h-5 text-[#A855F7]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#F5F5F5]">Submission Version History</h3>
            <p className="text-xs text-[#A7AFBC]">
              Complete immutable log of all project uploads ({submissions.length} total)
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#151A23] border border-[#343B47] text-xs font-mono text-[#22C55E] self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span>LATEST REVISION ACTIVE</span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs font-mono text-[#A7AFBC]">
          Loading submission logs...
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-12 text-center text-xs font-mono text-[#A7AFBC] border border-dashed border-[#343B47] rounded-lg mt-6">
          No submissions recorded yet. Use the form above to upload your initial project revision.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {submissions.map((sub, index) => {
            const isLatest = index === 0 || sub.isLatest;
            return (
              <div
                key={sub.id || index}
                className={`p-5 rounded-lg border transition-all ${
                  isLatest
                    ? "bg-[#151A23] border-[#A855F7]/70 shadow-md shadow-[#A855F7]/10"
                    : "bg-[#151A23]/50 border-[#343B47] opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#343B47]/50">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        isLatest
                          ? "bg-[#A855F7] text-[#151A23]"
                          : "bg-[#1C222C] text-[#A7AFBC] border border-[#343B47]"
                      }`}
                    >
                      SUBMISSION #{sub.submissionNumber}
                    </span>

                    {isLatest ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[11px] font-mono text-[#22C55E] font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        <span>CURRENT / ACTIVE FOR JUDGING</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-[#A7AFBC]">
                        Archived Version
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#A7AFBC]">
                    <Clock className="w-3.5 h-3.5 text-[#A855F7]" />
                    <span>{formatDate(sub.submittedAt)}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* PDF Details */}
                  <div className="p-3 rounded bg-[#1C222C] border border-[#343B47]/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-[#A855F7] shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-[#F5F5F5] truncate">
                          {sub.pdfOriginalName || "Submission.pdf"}
                        </div>
                        <div className="text-[10px] font-mono text-[#A7AFBC]">
                          {formatBytes(sub.pdfSizeBytes)} • Supabase Storage
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GitHub Repo */}
                  <div className="p-3 rounded bg-[#1C222C] border border-[#343B47]/80 flex items-center justify-between">
                    <div className="truncate min-w-0 pr-2">
                      <div className="text-[10px] font-mono text-[#A7AFBC]">Target Repository</div>
                      <div className="text-xs font-mono text-[#F5F5F5] truncate">
                        {sub.githubUrl}
                      </div>
                    </div>
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-[#151A23] hover:bg-[#A855F7] text-[#A7AFBC] hover:text-[#151A23] transition-colors shrink-0"
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
