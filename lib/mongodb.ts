import dns from "node:dns";
import { MongoClient, Db, Collection, ObjectId } from "mongodb";

/**
 * Explicitly configure reliable DNS resolvers (Google & Cloudflare Public DNS)
 * in Node.js environments. This resolves Atlas SRV (mongodb+srv://) lookup
 * failures (querySrv ECONNREFUSED) caused by local/ISP DNS resolvers that do not
 * support or reject SRV records.
 */
function configureMongoDns(): void {
  if (typeof window === "undefined") {
    try {
      if (typeof dns?.setServers === "function") {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      }
      if (typeof dns?.setDefaultResultOrder === "function") {
        dns.setDefaultResultOrder("ipv4first");
      }
    } catch {
      // Fallback silently if custom DNS cannot be set in current environment
    }
  }
}

// Ensure DNS resolvers are configured at module load time
configureMongoDns();

export interface TeamMember {
  name: string;
  regNo: string;
}

export interface TeamDocument {
  _id?: ObjectId;
  teamName: string;
  teamNameLower: string;
  passwordHash: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubmissionDocument {
  _id?: ObjectId;
  teamId: ObjectId;
  teamName: string;
  submissionNumber: number;
  pdfStoragePath: string;
  pdfOriginalName: string;
  pdfSizeBytes: number;
  githubUrl: string;
  submittedAt: Date;
  isLatest: boolean;
}

const dbName = process.env.MONGODB_DB || "rer_technovit";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function logSafeMongoError(err: unknown): void {
  const error = err as Error;
  const message = error?.message || String(err);
  const name = error?.name || "MongoError";

  // Sanitize any accidental URI or credential leaks from the error message
  const sanitizedMessage = message.replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, "mongodb+srv://[REDACTED]@");

  if (
    sanitizedMessage.includes("querySrv") ||
    sanitizedMessage.includes("ECONNREFUSED") ||
    sanitizedMessage.includes("ENOTFOUND")
  ) {
    console.error(`[MongoDB] DNS/SRV Resolution Error (${name}):`, sanitizedMessage);
  } else if (
    sanitizedMessage.includes("bad auth") ||
    sanitizedMessage.includes("AuthenticationFailed") ||
    sanitizedMessage.includes("auth failed")
  ) {
    console.error(`[MongoDB] Authentication Error (${name}): Authentication failed. Please check the database username and password in .env.local.`);
  } else if (
    sanitizedMessage.includes("TLS") ||
    sanitizedMessage.includes("SSL") ||
    sanitizedMessage.includes("certificate")
  ) {
    console.error(`[MongoDB] TLS/SSL Handshake Error (${name}):`, sanitizedMessage);
  } else if (
    sanitizedMessage.includes("MongoServerSelectionError") ||
    sanitizedMessage.includes("timed out")
  ) {
    console.error(`[MongoDB] Cluster Selection/Timeout Error (${name}): Unable to reach Atlas cluster. Ensure your current IP is whitelisted in Atlas Network Access.`);
  } else {
    console.error(`[MongoDB] Connection Error (${name}):`, sanitizedMessage);
  }
}

export function getMongoClientPromise(): Promise<MongoClient> {
  const currentUri = process.env.MONGODB_URI;
  if (!currentUri) {
    throw new Error(
      "Configuration Error: MONGODB_URI environment variable is missing. Please define MONGODB_URI in your .env.local file."
    );
  }

  // Ensure DNS is configured before connection attempt
  configureMongoDns();

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(currentUri);
      global._mongoClientPromise = client.connect().catch((err) => {
        delete global._mongoClientPromise;
        logSafeMongoError(err);
        throw err;
      });
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(currentUri);
      clientPromise = client.connect().catch((err) => {
        clientPromise = null;
        logSafeMongoError(err);
        throw err;
      });
    }
    return clientPromise;
  }
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db(dbName);
}

export async function getTeamsCollection(): Promise<Collection<TeamDocument>> {
  const db = await getMongoDb();
  const collection = db.collection<TeamDocument>("teams");
  
  // Ensure unique index on teamNameLower
  try {
    await collection.createIndex({ teamNameLower: 1 }, { unique: true });
  } catch {
    // Index might already exist or ignore in read-only scenarios
  }
  
  return collection;
}

export async function getSubmissionsCollection(): Promise<Collection<SubmissionDocument>> {
  const db = await getMongoDb();
  const collection = db.collection<SubmissionDocument>("submissions");
  
  // Ensure compound index for fast queries by teamId and timestamp
  try {
    await collection.createIndex({ teamId: 1, submittedAt: -1 });
  } catch {
    // Ignore index creation collision
  }
  
  return collection;
}
