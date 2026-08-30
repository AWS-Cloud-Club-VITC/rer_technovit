"use client";

import { useState } from "react";
import {
  Shield,
  KeyRound,
  Users,
  UserPlus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/config";
import {
  validateTeamName,
  validatePassword,
  validateMembers,
} from "@/lib/validation";
import { TeamMember } from "@/lib/mongodb";

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

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: regTeamName.trim(),
          password: regPassword,
          confirmPassword: regConfirmPassword,
          members: regMembers,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      setSuccessMessage("Team registered successfully!");
      onAuthSuccess(data.team);
    } catch (err) {
      setErrorMessage((err as Error).message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      {/* Cyber card container */}
      <div className="cyber-card rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle top ambient lighting */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--accent)]/08 blur-[60px] pointer-events-none rounded-full" />

        {/* Tab switch */}
        <div className="flex rounded-xl bg-[var(--surface-secondary)] p-1.5 border border-[var(--border)] mb-8">
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
              authMode === "login"
                ? "bg-[var(--accent)] text-white shadow-md"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]/60"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>EXISTING TEAM LOGIN</span>
          </button>

          <button
            type="button"
            onClick={() => switchTab("register")}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
              authMode === "register"
                ? "bg-[var(--accent)] text-white shadow-md"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]/60"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>NEW TEAM SIGNUP</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--status-error-bg)] border border-[var(--status-error-border)] flex items-start gap-3 text-xs text-[var(--status-error-text)]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--status-ready-bg)] border border-[var(--status-ready-border)] flex items-start gap-3 text-xs text-[var(--status-ready-text)]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="text-center sm:text-left mb-6">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Welcome Back</h2>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                Enter your registered team credentials to access submissions and roster.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[var(--foreground)] mb-2 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                <span>Team Name <span className="text-[var(--status-error-text)]">*</span></span>
              </label>
              <input
                type="text"
                required
                value={loginTeamName}
                onChange={(e) => setLoginTeamName(e.target.value)}
                placeholder="e.g. ByteBusters"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 transition-all font-mono shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[var(--foreground)] mb-2 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                <span>Team Password <span className="text-[var(--status-error-text)]">*</span></span>
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 transition-all font-mono shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !loginTeamName || !loginPassword}
              className="w-full mt-4 py-3.5 px-6 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99]"
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
              <h2 className="text-xl font-bold text-[var(--foreground)]">New Team Registration</h2>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                Register your team name and member roster to get started.
              </p>
            </div>

            {/* Team Name */}
            <div>
              <label className="block text-xs font-mono font-medium text-[var(--foreground)] mb-2 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                <span>Team Name <span className="text-[var(--status-error-text)]">*</span></span>
              </label>
              <input
                type="text"
                required
                value={regTeamName}
                onChange={(e) => setRegTeamName(e.target.value)}
                placeholder="e.g. CyberRoulette"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 transition-all font-mono shadow-2xs"
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[var(--foreground)] mb-2 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                  <span>Password <span className="text-[var(--status-error-text)]">*</span></span>
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 transition-all font-mono shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[var(--foreground)] mb-2 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                  <span>Confirm Password <span className="text-[var(--status-error-text)]">*</span></span>
                </label>
                <input
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 transition-all font-mono shadow-2xs"
                />
              </div>
            </div>

            {/* Team Members Roster */}
            <div className="pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-medium text-[var(--foreground)] flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                  <span>
                    Team Members ({regMembers.length}/{APP_CONFIG.maxTeamMembers}) <span className="text-[var(--status-error-text)]">*</span>
                  </span>
                </label>

                {regMembers.length < APP_CONFIG.maxTeamMembers && (
                  <button
                    type="button"
                    onClick={addMember}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-text)] hover:text-[var(--accent-hover)] transition-colors font-semibold"
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
                    className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex flex-col sm:flex-row items-center gap-3"
                  >
                    <span className="text-xs font-mono text-[var(--accent-text)] shrink-0 font-bold">
                      0{idx + 1}
                    </span>

                    <input
                      type="text"
                      required
                      placeholder="Student Full Name"
                      value={member.name}
                      onChange={(e) => updateMember(idx, "name", e.target.value)}
                      disabled={isLoading}
                      className="w-full sm:flex-1 px-3.5 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-xs text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] shadow-2xs"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Reg No (e.g. 21BCE1001)"
                      value={member.regNo}
                      onChange={(e) => updateMember(idx, "regNo", e.target.value.toUpperCase())}
                      disabled={isLoading}
                      className="w-full sm:w-44 px-3.5 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-xs font-mono text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] shadow-2xs"
                    />

                    {regMembers.length > APP_CONFIG.minTeamMembers && (
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        disabled={isLoading}
                        className="p-2 rounded-lg hover:bg-[var(--status-error-bg)] text-[var(--foreground-muted)] hover:text-[var(--status-error-text)] transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !regTeamName || !regPassword || !regConfirmPassword}
              className="w-full mt-4 py-3.5 px-6 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>REGISTERING TEAM...</span>
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
