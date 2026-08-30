"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { APP_CONFIG } from "@/lib/config";
import { validateGitHubUrl, validatePdfFile } from "@/lib/validation";

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
}

export default function SubmissionForm({ onSuccess }: SubmissionFormProps) {
  const [githubUrl, setGithubUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePdfFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid PDF file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setPdfFile(file);
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client-side validation
    const ghVal = validateGitHubUrl(githubUrl);
    if (!ghVal.isValid) {
      setErrorMessage(ghVal.error || "Please enter a valid GitHub repository URL.");
      return;
    }

    if (!pdfFile) {
      setErrorMessage("Please select a PDF file to upload.");
      return;
    }

    const pdfVal = validatePdfFile({
      name: pdfFile.name,
      size: pdfFile.size,
      type: pdfFile.type,
    });
    if (!pdfVal.isValid) {
      setErrorMessage(pdfVal.error || "Invalid PDF file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("githubUrl", githubUrl.trim());
      formData.append("pdf", pdfFile);

      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      setSuccessMessage(data.message || "New submission uploaded successfully!");
      setGithubUrl("");
      setPdfFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onSuccess();
    } catch (err) {
      setErrorMessage((err as Error).message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="cyber-card rounded-2xl p-6 sm:p-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-6 border-b border-[var(--border-subtle)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-surface)] border border-[var(--accent-border)] flex items-center justify-center">
          <UploadCloud className="w-5 h-5 text-[var(--accent-text)]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">New Project Submission</h3>
          <p className="text-xs text-[var(--foreground-muted)]">
            Upload a revised architectural PDF and updated GitHub repository link.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-[var(--status-error-bg)] border border-[var(--status-error-border)] flex items-start gap-3 text-xs text-[var(--status-error-text)]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-[var(--status-ready-bg)] border border-[var(--status-ready-border)] flex items-start gap-3 text-xs text-[var(--status-ready-text)]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* GitHub Repository URL Input */}
        <div>
          <label className="block text-xs font-mono font-medium text-[var(--foreground)] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GithubIcon className="w-4 h-4 text-[var(--accent-text)]" />
              <span>GitHub Repository URL <span className="text-[var(--status-error-text)]">*</span></span>
            </span>
            <span className="text-[11px] text-[var(--foreground-muted)]">https://github.com/org/repo</span>
          </label>
          <input
            type="url"
            required
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/your-team/reverse-engineering-roulette"
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 transition-all font-mono shadow-2xs"
          />
        </div>

        {/* PDF File Upload */}
        <div>
          <label className="block text-xs font-mono font-medium text-[var(--foreground)] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--accent-text)]" />
              <span>Architectural / Design PDF <span className="text-[var(--status-error-text)]">*</span></span>
            </span>
            <span className="text-[11px] text-[var(--foreground-muted)] font-mono">Max {APP_CONFIG.maxPdfSizeDisplay}</span>
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            disabled={isSubmitting}
            className="hidden"
            id="pdf-upload-input"
          />

          {!pdfFile ? (
            <label
              htmlFor="pdf-upload-input"
              className="flex flex-col items-center justify-center p-7 border-2 border-dashed border-[var(--input-border)] hover:border-[var(--accent)] rounded-xl bg-[var(--surface-secondary)] hover:bg-[var(--accent-surface)] cursor-pointer group transition-all"
            >
              <UploadCloud className="w-9 h-9 text-[var(--foreground-muted)] group-hover:text-[var(--accent-text)] group-hover:scale-110 transition-all mb-2.5" />
              <span className="text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--accent-text)]">
                Click or drag PDF file here to upload
              </span>
              <span className="text-[11px] font-mono text-[var(--foreground-muted)] mt-1">
                Accepted: .pdf only (Max {APP_CONFIG.maxPdfSizeDisplay})
              </span>
            </label>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[var(--status-ready-text)]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--foreground)] truncate max-w-[240px] sm:max-w-md">
                    {pdfFile.name}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--foreground-muted)]">
                    {formatFileSize(pdfFile.size)} • Ready for upload
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={isSubmitting}
                className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--status-error-bg)] text-[var(--foreground-muted)] hover:text-[var(--status-error-text)] transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !pdfFile || !githubUrl}
            className="w-full py-3.5 px-6 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>UPLOADING & STORING SUBMISSION...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>SUBMIT REVISION</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] font-mono text-[var(--foreground-muted)] mt-2.5">
            Note: Submitting a new revision preserves past records while designating this upload as the active version for judging.
          </p>
        </div>
      </form>
    </div>
  );
}
