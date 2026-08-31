"use client";

import { useState } from "react";
import { UploadCloud, Link as LinkIcon, AlertCircle, CheckCircle2, Loader2, Layers } from "lucide-react";
import { validateGitHubUrl, validateDemoVideoUrl } from "@/lib/validation";
import { EVENT_CONFIG } from "@/lib/config";
import type { SubmissionItem } from "./SubmissionHistory";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

interface SubmissionFormProps {
  onSuccess: () => void;
  latestByRound?: Record<number, SubmissionItem | null>;
}

export default function SubmissionForm({ onSuccess, latestByRound }: SubmissionFormProps) {
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [githubUrl, setGithubUrl] = useState("");
  const [demoVideoUrl, setDemoVideoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRoundChange = (roundNumber: number) => {
    setSelectedRound(roundNumber);
    setErrorMessage(null);
    setSuccessMessage(null);
    // Optionally populate form with existing latest submission for that round
    const existing = latestByRound?.[roundNumber];
    if (existing) {
      setGithubUrl(existing.githubUrl);
      setDemoVideoUrl(existing.demoVideoUrl);
    } else {
      setGithubUrl("");
      setDemoVideoUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const ghVal = validateGitHubUrl(githubUrl);
    if (!ghVal.isValid) {
      setErrorMessage(ghVal.error || "Please enter a valid GitHub repository URL.");
      return;
    }

    const demoVal = validateDemoVideoUrl(demoVideoUrl);
    if (!demoVal.isValid) {
      setErrorMessage(demoVal.error || "Please enter a valid Google Drive video link.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roundNumber: selectedRound,
          githubUrl: githubUrl.trim(),
          demoVideoUrl: demoVideoUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      setSuccessMessage(data.message || `Round ${selectedRound} submission saved successfully!`);
      onSuccess();
    } catch (err) {
      setErrorMessage((err as Error).message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cyber-card rounded-2xl p-6 sm:p-8 transition-colors duration-200">
      <div className="flex items-center gap-3.5 pb-6 border-b border-[var(--border-subtle)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-surface)] border border-[var(--accent-border)] flex items-center justify-center">
          <UploadCloud className="w-5 h-5 text-[var(--accent-text)]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">Project Submission (2 Rounds)</h3>
          <p className="text-xs text-[var(--foreground-muted)]">
            Select a round and submit your GitHub repository link and Google Drive video link for evaluation.
          </p>
        </div>
      </div>

      {/* Round Selection Tabs */}
      <div className="mt-6">
        <label className="block text-xs font-mono font-medium text-[var(--foreground)] mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--accent-text)]" />
          <span>Select Competition Round <span className="text-[var(--status-error-text)]">*</span></span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {EVENT_CONFIG.rounds.map((round) => {
            const isSelected = selectedRound === round.number;
            const hasSubmission = Boolean(latestByRound?.[round.number]);
            return (
              <button
                key={round.number}
                type="button"
                onClick={() => handleRoundChange(round.number)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-[var(--accent-surface)] border-[var(--accent-border)] ring-2 ring-[var(--accent)]/30"
                    : "bg-[var(--surface-secondary)] border-[var(--border)] hover:border-[var(--accent)]/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-mono font-bold ${isSelected ? "text-[var(--accent-text)]" : "text-[var(--foreground)]"}`}>
                    Round {round.number}
                  </span>
                  {hasSubmission ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--status-ready-text)] font-semibold bg-[var(--status-ready-bg)] px-2 py-0.5 rounded-full border border-[var(--status-ready-border)]">
                      <CheckCircle2 className="w-3 h-3" /> Submitted
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[var(--foreground-muted)] bg-[var(--surface)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                      Pending
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-semibold text-[var(--foreground)] mt-1 truncate">
                  {round.name}
                </div>
                <div className="text-[10px] text-[var(--foreground-muted)] truncate">
                  {round.focus}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-[var(--status-error-bg)] border border-[var(--status-error-border)] flex items-start gap-3 text-xs text-[var(--status-error-text)]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-[var(--status-ready-bg)] border border-[var(--status-ready-border)] flex items-start gap-3 text-xs text-[var(--status-ready-text)]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-mono font-medium text-[var(--foreground)] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GithubIcon className="w-4 h-4 text-[var(--accent-text)]" />
              <span>Round {selectedRound} GitHub Repository URL <span className="text-[var(--status-error-text)]">*</span></span>
            </span>
            <span className="text-[11px] text-[var(--foreground-muted)]">https://github.com/org/repo</span>
          </label>
          <input
            type="url"
            required
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder={`https://github.com/your-team/round-${selectedRound}-solution`}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 transition-all font-mono shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-[var(--foreground)] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-[var(--accent-text)]" />
              <span>Round {selectedRound} Google Drive Video Link <span className="text-[var(--status-error-text)]">*</span></span>
            </span>
            <span className="text-[11px] text-[var(--foreground-muted)]">https://drive.google.com/...</span>
          </label>
          <input
            type="url"
            required
            value={demoVideoUrl}
            onChange={(e) => setDemoVideoUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/1fSr5gEoPzhGG3x_ijroiZGLvhYZIfQpz/view?usp=drive_link"
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 transition-all font-mono shadow-2xs"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !demoVideoUrl || !githubUrl}
            className="w-full py-3.5 px-6 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SUBMITTING ROUND {selectedRound}...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>SUBMIT FOR ROUND {selectedRound}</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] font-mono text-[var(--foreground-muted)] mt-2.5">
            Note: Submitting updates the active links for Round {selectedRound} while retaining past history logs.
          </p>
        </div>
      </form>
    </div>
  );
}

