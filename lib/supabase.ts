import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Configuration Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Please define these in your .env.local file."
    );
  }

  supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseAdminClient;
}

export async function uploadSubmissionPdf({
  fileBuffer,
  originalFilename,
  teamId,
  submissionId,
  contentType = "application/pdf",
}: {
  fileBuffer: Buffer | Uint8Array;
  originalFilename: string;
  teamId: string;
  submissionId: string;
  contentType?: string;
}): Promise<{ storagePath: string; publicUrl?: string }> {
  const supabase = getSupabaseAdmin();
  const bucketName = process.env.SUPABASE_BUCKET || "rer-submissions";

  const timestamp = Date.now();
  const sanitizedName = originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `submissions/${teamId}/${submissionId}_${timestamp}_${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    if (error.message?.toLowerCase().includes("bucket not found") || (error as { statusCode?: string }).statusCode === "404") {
      try {
        await supabase.storage.createBucket(bucketName, { public: true });
        const retry = await supabase.storage.from(bucketName).upload(storagePath, fileBuffer, {
          contentType,
          upsert: false,
        });
        if (retry.error) {
          throw new Error(`Storage upload failed: ${retry.error.message}`);
        }
      } catch (bucketErr) {
        throw new Error(`Failed to upload to Supabase bucket "${bucketName}": ${(bucketErr as Error).message || error.message}`);
      }
    } else {
      throw new Error(`Storage upload failed: ${error.message}`);
    }
  }

  const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);

  return {
    storagePath: data?.path || storagePath,
    publicUrl: urlData?.publicUrl,
  };
}
