import { APP_CONFIG, EVENT_CONFIG } from "./config";
import type { TeamMember } from "./mongodb";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates team name
 */
export function validateTeamName(teamName?: string): ValidationResult {
  if (!teamName || typeof teamName !== "string") {
    return { isValid: false, error: "Team name is required." };
  }
  const trimmed = teamName.trim();
  if (trimmed.length < 2) {
    return { isValid: false, error: "Team name must be at least 2 characters long." };
  }
  if (trimmed.length > 50) {
    return { isValid: false, error: "Team name cannot exceed 50 characters." };
  }
  return { isValid: true };
}

/**
 * Validates password
 */
export function validatePassword(password?: string): ValidationResult {
  if (!password || typeof password !== "string") {
    return { isValid: false, error: "Password is required." };
  }
  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters long." };
  }
  if (password.length > 100) {
    return { isValid: false, error: "Password cannot exceed 100 characters." };
  }
  return { isValid: true };
}

/**
 * Validates GitHub repository URL
 */
export function validateGitHubUrl(url?: string): ValidationResult {
  if (!url || typeof url !== "string") {
    return { isValid: false, error: "GitHub repository URL is required." };
  }
  const trimmed = url.trim();
  
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (host !== "github.com" && host !== "www.github.com") {
      return {
        isValid: false,
        error: "Please enter a valid GitHub URL (e.g., https://github.com/username/repository).",
      };
    }
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      return {
        isValid: false,
        error: "GitHub URL must include username and repository name (https://github.com/owner/repo).",
      };
    }
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: "Please enter a valid GitHub repository URL format.",
    };
  }
}

/**
 * Validates array of team members
 */
export function validateMembers(members?: TeamMember[]): ValidationResult {
  if (!Array.isArray(members) || members.length < APP_CONFIG.minTeamMembers) {
    return {
      isValid: false,
      error: `At least ${APP_CONFIG.minTeamMembers} team member is required.`,
    };
  }

  if (members.length > APP_CONFIG.maxTeamMembers) {
    return {
      isValid: false,
      error: `A team cannot have more than ${APP_CONFIG.maxTeamMembers} members.`,
    };
  }

  const seenRegNos = new Set<string>();

  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    if (!member || typeof member !== "object") {
      return { isValid: false, error: `Invalid member data at position ${i + 1}.` };
    }

    const name = member.name?.trim();
    const regNo = member.regNo?.trim().toUpperCase();

    if (!name || name.length < 2) {
      return {
        isValid: false,
        error: `Member #${i + 1}: Name is required (minimum 2 characters).`,
      };
    }

    if (!regNo || regNo.length < 2) {
      return {
        isValid: false,
        error: `Member #${i + 1}: Registration Number is required.`,
      };
    }

    if (seenRegNos.has(regNo)) {
      return {
        isValid: false,
        error: `Duplicate registration number "${regNo}" detected among team members.`,
      };
    }
    seenRegNos.add(regNo);
  }

  return { isValid: true };
}

/**
 * Validates demo video URL - only accepts Google Drive links
 */
export function validateDemoVideoUrl(url?: string): ValidationResult {
  if (!url || typeof url !== "string") {
    return { isValid: false, error: "Demo Video Link is required." };
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();
    const hostname = parsed.hostname.toLowerCase();

    if (protocol !== "http:" && protocol !== "https:") {
      return {
        isValid: false,
        error: "Please enter a valid Google Drive video link.",
      };
    }

    if (hostname !== "drive.google.com" && hostname !== "www.drive.google.com") {
      return {
        isValid: false,
        error: "Please enter a valid Google Drive video link.",
      };
    }

    const pathname = parsed.pathname.toLowerCase();
    if (!pathname.includes("/file/d/")) {
      return {
        isValid: false,
        error: "Please enter a valid Google Drive video link (e.g., https://drive.google.com/file/d/...).",
      };
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: "Please enter a valid Google Drive video link.",
    };
  }
}

/**
 * Validates competition round number (must be 1 or 2)
 */
export function validateRoundNumber(roundNumber?: unknown): ValidationResult {
  const maxRounds = EVENT_CONFIG.rounds.length;
  const round = Number(roundNumber);
  if (!roundNumber || isNaN(round) || !Number.isInteger(round) || round < 1 || round > maxRounds) {
    return {
      isValid: false,
      error: `Invalid round number. Please select Round 1 or Round 2.`,
    };
  }

  const roundConfig = EVENT_CONFIG.rounds.find((r) => r.number === round);
  if (roundConfig && !roundConfig.submissionOpen) {
    return {
      isValid: false,
      error: `Submissions for Round ${round} are currently closed.`,
    };
  }

  return { isValid: true };
}

