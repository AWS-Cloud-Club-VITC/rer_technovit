"use client";

import { useState, useRef } from "react";
import {
  Shield,
  KeyRound,
  Users,
  UserPlus,
  Trash2,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowRight,
  X,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/config";
import {
  validateTeamName,
  validatePassword,
  validateMembers,
  validateGitHubUrl,
  validatePdfFile,
} from "@/lib/validation";
import { TeamMember } from "@/lib/mongodb";

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

interface TeamAuthProps {
  onAuthSuccess: (team: {
    teamId: string;
    teamName: string;
    members: TeamMember[];
  }) => void;
}

export default function TeamAuth({ onAuthSuccess }: TeamAuthProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Login state
  const [loginTeamName, setLoginTeamName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [regTeamName, setRegTeamName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regMembers, setRegMembers] = useState<TeamMember[]>([
    { name: "", regNo: "" },
  ]);
  const [regGithubUrl, setRegGithubUrl] = useState("");
  const [regPdfFile, setRegPdfFile] = useState<File | null>(null);

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Switch tabs
  const switchTab = (mode: "login" | "register") => {
    setAuthMode(mode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Member roster management
  const addMember = () => {
    if (regMembers.length < APP_CONFIG.maxTeamMembers) {
      setRegMembers([...regMembers, { name: "", regNo: "" }]);
    }
  };

  const removeMember = (indexToRemove: number) => {
    if (regMembers.length > APP_CONFIG.minTeamMembers) {
      setRegMembers(regMembers.filter((_, idx) => idx !== indexToRemove));
    }
  };

  const updateMember = (
    index: number,
    field: "name" | "regNo",
    value: string
  ) => {
    const updated = [...regMembers];
    updated[index][field] = value;
    setRegMembers(updated);
  };

  // File handler
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const val = validatePdfFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!val.isValid) {
      setErrorMessage(val.error || "Invalid PDF file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setRegPdfFile(file);
  };

  const handleRemovePdf = () => {
    setRegPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const teamVal = validateTeamName(loginTeamName);
    if (!teamVal.isValid) {
      setErrorMessage(teamVal.error || "Please enter your team name.");
      return;
    }

    const passVal = validatePassword(loginPassword);
    if (!passVal.isValid) {
      setErrorMessage(passVal.error || "Please enter your team password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: loginTeamName.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid team name or password.");
      }

      setSuccessMessage("Authentication successful! Redirecting...");
      onAuthSuccess(data.team);
    } catch (err) {
      setErrorMessage((err as Error).message || "Login failed. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    const teamVal = validateTeamName(regTeamName);
    if (!teamVal.isValid) {
      setErrorMessage(teamVal.error || "Invalid team name.");
      return;
    }

    const passVal = validatePassword(regPassword);
    if (!passVal.isValid) {
      setErrorMessage(passVal.error || "Invalid password.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Passwords do not match. Please recheck.");
      return;
    }

    const membersVal = validateMembers(regMembers);
    if (!membersVal.isValid) {
      setErrorMessage(membersVal.error || "Invalid team members.");
      return;
    }

    const ghVal = validateGitHubUrl(regGithubUrl);
    if (!ghVal.isValid) {
      setErrorMessage(ghVal.error || "Invalid GitHub repository URL.");
      return;
    }

    if (!regPdfFile) {
      setErrorMessage("Architectural PDF file is required for registration.");
      return;
    }

    const pdfVal = validatePdfFile({
      name: regPdfFile.name,
      size: regPdfFile.size,
      type: regPdfFile.type,
    });
    if (!pdfVal.isValid) {
      setErrorMessage(pdfVal.error || "Invalid PDF file.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("teamName", regTeamName.trim());
      formData.append("password", regPassword);
      formData.append("confirmPassword", regConfirmPassword);
      formData.append("members", JSON.stringify(regMembers));
      formData.append("githubUrl", regGithubUrl.trim());
      formData.append("pdf", regPdfFile);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      setSuccessMessage("Team registered and initial submission saved!");
      onAuthSuccess(data.team);
    } catch (err) {
      setErrorMessage((err as Error).message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      {/* Cyber card container */}
      <div className="cyber-card rounded-2xl p-6 sm:p-8 bg-[#1C222C] border border-[#343B47] shadow-xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#A855F7]/10 blur-[60px] pointer-events-none rounded-full" />

        {/* Tab switch */}
        <div className="flex rounded-lg bg-[#151A23] p-1 border border-[#343B47] mb-8">
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`flex-1 py-2.5 rounded-md text-xs sm:text-sm font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
              authMode === "login"
                ? "bg-[#A855F7] text-[#151A23] shadow-md shadow-[#A855F7]/20"
                : "text-[#A7AFBC] hover:text-[#F5F5F5]"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>EXISTING TEAM LOGIN</span>
          </button>

          <button
            type="button"
            onClick={() => switchTab("register")}
            className={`flex-1 py-2.5 rounded-md text-xs sm:text-sm font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
              authMode === "register"
                ? "bg-[#A855F7] text-[#151A23] shadow-md shadow-[#A855F7]/20"
                : "text-[#A7AFBC] hover:text-[#F5F5F5]"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>NEW TEAM SIGNUP</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/40 flex items-start gap-3 text-xs text-[#EF4444]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/40 flex items-start gap-3 text-xs text-[#22C55E]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="text-center sm:text-left mb-6">
              <h2 className="text-xl font-bold text-[#F5F5F5]">Welcome Back</h2>
              <p className="text-xs text-[#A7AFBC] mt-1">
                Enter your registered team credentials to access submissions and roster.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#F5F5F5] mb-2 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>Team Name <span className="text-[#EF4444]">*</span></span>
              </label>
              <input
                type="text"
                required
                value={loginTeamName}
                onChange={(e) => setLoginTeamName(e.target.value)}
                placeholder="e.g. ByteBusters"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-[#151A23] border border-[#343B47] text-sm text-[#F5F5F5] placeholder-[#A7AFBC]/40 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] disabled:opacity-50 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#F5F5F5] mb-2 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>Team Password <span className="text-[#EF4444]">*</span></span>
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-[#151A23] border border-[#343B47] text-sm text-[#F5F5F5] placeholder-[#A7AFBC]/40 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] disabled:opacity-50 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !loginTeamName || !loginPassword}
              className="w-full mt-4 py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#9333EA] hover:from-[#B45CFF] hover:to-[#A855F7] text-[#151A23] font-bold text-sm tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-[#A855F7]/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING TEAM...</span>
                </>
              ) : (
                <>
                  <span>LOGIN TO PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {authMode === "register" && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="text-center sm:text-left mb-4">
              <h2 className="text-xl font-bold text-[#F5F5F5]">New Team Registration</h2>
              <p className="text-xs text-[#A7AFBC] mt-1">
                Register your team roster and submit your initial project artifacts.
              </p>
            </div>

            {/* Team Name */}
            <div>
              <label className="block text-xs font-mono font-medium text-[#F5F5F5] mb-2 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>Team Name <span className="text-[#EF4444]">*</span></span>
              </label>
              <input
                type="text"
                required
                value={regTeamName}
                onChange={(e) => setRegTeamName(e.target.value)}
                placeholder="e.g. CyberRoulette"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-[#151A23] border border-[#343B47] text-sm text-[#F5F5F5] placeholder-[#A7AFBC]/40 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] disabled:opacity-50 transition-all font-mono"
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#F5F5F5] mb-2 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>Password <span className="text-[#EF4444]">*</span></span>
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-[#151A23] border border-[#343B47] text-sm text-[#F5F5F5] placeholder-[#A7AFBC]/40 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] disabled:opacity-50 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#F5F5F5] mb-2 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>Confirm Password <span className="text-[#EF4444]">*</span></span>
                </label>
                <input
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-[#151A23] border border-[#343B47] text-sm text-[#F5F5F5] placeholder-[#A7AFBC]/40 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] disabled:opacity-50 transition-all font-mono"
                />
              </div>
            </div>

            {/* Team Members Roster */}
            <div className="pt-2 border-t border-[#343B47]/60">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-medium text-[#F5F5F5] flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>
                    Team Members ({regMembers.length}/{APP_CONFIG.maxTeamMembers}) <span className="text-[#EF4444]">*</span>
                  </span>
                </label>

                {regMembers.length < APP_CONFIG.maxTeamMembers && (
                  <button
                    type="button"
                    onClick={addMember}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#A855F7] hover:text-[#B45CFF] transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {regMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-[#151A23] border border-[#343B47] flex flex-col sm:flex-row items-center gap-3"
                  >
                    <span className="text-xs font-mono text-[#A855F7] shrink-0">
                      0{idx + 1}
                    </span>

                    <input
                      type="text"
                      required
                      placeholder="Student Full Name"
                      value={member.name}
                      onChange={(e) => updateMember(idx, "name", e.target.value)}
                      disabled={isLoading}
                      className="w-full sm:flex-1 px-3 py-2 rounded bg-[#1C222C] border border-[#343B47] text-xs text-[#F5F5F5] placeholder-[#A7AFBC]/40 focus:outline-none focus:border-[#A855F7]"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Reg No (e.g. 21BCE1001)"
                      value={member.regNo}
                      onChange={(e) => updateMember(idx, "regNo", e.target.value.toUpperCase())}
                      disabled={isLoading}
                      className="w-full sm:w-44 px-3 py-2 rounded bg-[#1C222C] border border-[#343B47] text-xs font-mono text-[#F5F5F5] placeholder-[#A7AFBC]/40 focus:outline-none focus:border-[#A855F7]"
                    />

                    {regMembers.length > APP_CONFIG.minTeamMembers && (
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        disabled={isLoading}
                        className="p-2 rounded hover:bg-[#EF4444]/20 text-[#A7AFBC] hover:text-[#EF4444] transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Section */}
            <div className="pt-2 border-t border-[#343B47]/60 space-y-4">
              <div className="text-xs font-mono text-[#A7AFBC]">INITIAL PROJECT ARTIFACTS</div>

              {/* GitHub URL */}
              <div>
                <label className="block text-xs font-mono font-medium text-[#F5F5F5] mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <GithubIcon className="w-3.5 h-3.5 text-[#A855F7]" />
                    <span>GitHub Repository URL <span className="text-[#EF4444]">*</span></span>
                  </span>
                  <span className="text-[10px] text-[#A7AFBC]">https://github.com/org/repo</span>
                </label>
                <input
                  type="url"
                  required
                  value={regGithubUrl}
                  onChange={(e) => setRegGithubUrl(e.target.value)}
                  placeholder="https://github.com/team/reverse-engineering"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-[#151A23] border border-[#343B47] text-sm text-[#F5F5F5] placeholder-[#A7AFBC]/40 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] font-mono"
                />
              </div>

              {/* PDF Upload */}
              <div>
                <label className="block text-xs font-mono font-medium text-[#F5F5F5] mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#A855F7]" />
                    <span>Architectural PDF Document <span className="text-[#EF4444]">*</span></span>
                  </span>
                  <span className="text-[10px] text-[#A7AFBC]">Max {APP_CONFIG.maxPdfSizeDisplay}</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePdfChange}
                  accept=".pdf,application/pdf"
                  disabled={isLoading}
                  className="hidden"
                  id="reg-pdf-upload"
                />

                {!regPdfFile ? (
                  <label
                    htmlFor="reg-pdf-upload"
                    className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#343B47] hover:border-[#A855F7] rounded-lg bg-[#151A23]/60 cursor-pointer group transition-all"
                  >
                    <UploadCloud className="w-7 h-7 text-[#A7AFBC] group-hover:text-[#A855F7] transition-colors mb-1.5" />
                    <span className="text-xs font-semibold text-[#F5F5F5] group-hover:text-[#B45CFF]">
                      Click to upload team PDF
                    </span>
                    <span className="text-[10px] font-mono text-[#A7AFBC] mt-0.5">
                      Accepted: .pdf only (Max {APP_CONFIG.maxPdfSizeDisplay})
                    </span>
                  </label>
                ) : (
                  <div className="p-3.5 rounded-lg bg-[#151A23] border border-[#343B47] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#22C55E]" />
                      <div className="truncate max-w-[220px] sm:max-w-xs">
                        <div className="text-xs font-bold text-[#F5F5F5] truncate">
                          {regPdfFile.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#A7AFBC]">
                          {formatFileSize(regPdfFile.size)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      disabled={isLoading}
                      className="p-1 rounded hover:bg-[#EF4444]/20 text-[#A7AFBC] hover:text-[#EF4444]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !regTeamName || !regPassword || !regPdfFile || !regGithubUrl}
              className="w-full mt-4 py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#9333EA] hover:from-[#B45CFF] hover:to-[#A855F7] text-[#151A23] font-bold text-sm tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-[#A855F7]/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>REGISTERING TEAM & ARTIFACTS...</span>
                </>
              ) : (
                <>
                  <span>REGISTER TEAM & PROCEED</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
