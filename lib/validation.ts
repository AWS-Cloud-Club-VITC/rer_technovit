import { APP_CONFIG } from "./config";
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
 * Validates uploaded PDF file metadata / buffer
 */
export function validatePdfFile(file?: {
  name: string;
  size: number;
  type: string;
} | null): ValidationResult {
  if (!file) {
    return { isValid: false, error: "PDF submission file is required." };
  }

  const isPdfMime = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdfMime) {
    return { isValid: false, error: "Only PDF files are accepted." };
  }

  if (file.size <= 0) {
    return { isValid: false, error: "The submitted PDF file is empty." };
  }

  if (file.size > APP_CONFIG.maxPdfSizeBytes) {
    return {
      isValid: false,
      error: `PDF exceeds the allowed size of ${APP_CONFIG.maxPdfSizeDisplay}.`,
    };
  }

  return { isValid: true };
}
