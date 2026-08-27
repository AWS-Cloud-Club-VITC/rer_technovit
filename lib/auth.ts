import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { APP_CONFIG } from "./config";

const JWT_SECRET = process.env.JWT_SECRET || "rer-technovit-2026-super-secret-key-salt-987123";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  teamId: string;
  teamName: string;
}

/**
 * Securely hashes a plain-text password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plain-text password against a stored bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Signs a JWT session token for the authenticated team.
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${APP_CONFIG.sessionExpirySeconds}s`)
    .sign(secretKey);
}

/**
 * Verifies a JWT session token and returns the decoded payload, or null if invalid/expired.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    if (typeof payload.teamId === "string" && typeof payload.teamName === "string") {
      return {
        teamId: payload.teamId,
        teamName: payload.teamName,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Retrieves the currently authenticated team from HTTP-only session cookies in Route Handlers / Server Components.
 */
export async function getAuthenticatedTeam(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(APP_CONFIG.cookieName)?.value;
    if (!token) {
      return null;
    }
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    name: APP_CONFIG.cookieName,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: APP_CONFIG.sessionExpirySeconds,
  };
}
