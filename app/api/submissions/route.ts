import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSubmissionsCollection } from "@/lib/mongodb";
import { getAuthenticatedTeam } from "@/lib/auth";
import { uploadSubmissionPdf } from "@/lib/supabase";
import { validateGitHubUrl, validatePdfFile } from "@/lib/validation";

// GET: Fetch submission history for authenticated team
export async function GET() {
  try {
    const session = await getAuthenticatedTeam();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const submissionsCollection = await getSubmissionsCollection();
    const teamSubmissions = await submissionsCollection
      .find({ teamId: new ObjectId(session.teamId) })
      .sort({ submissionNumber: -1 })
      .toArray();

    const formatted = teamSubmissions.map((sub, index) => ({
      id: sub._id!.toString(),
      submissionNumber: sub.submissionNumber,
      pdfStoragePath: sub.pdfStoragePath,
      pdfOriginalName: sub.pdfOriginalName,
      pdfSizeBytes: sub.pdfSizeBytes,
      githubUrl: sub.githubUrl,
      submittedAt: sub.submittedAt,
      isLatest: index === 0, // Latest submission is the first in descending order
    }));

    return NextResponse.json(
      {
        success: true,
        submissions: formatted,
        latestSubmission: formatted[0] || null,
        totalSubmissions: formatted.length,
      },
      { status: 200 }
    );
  } catch (err) {
    const rawMessage = (err as Error).message || "Failed to fetch submissions.";
    const sanitizedMessage = rawMessage.replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, "mongodb+srv://[REDACTED]@");
    return NextResponse.json({ success: false, error: sanitizedMessage }, { status: 500 });
  }
}

// POST: Add a new submission for authenticated team
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedTeam();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const githubUrl = formData.get("githubUrl") as string | null;
    const pdfFile = formData.get("pdf") as File | null;

    // 1. Validate GitHub URL
    const githubVal = validateGitHubUrl(githubUrl ?? undefined);
    if (!githubVal.isValid) {
      return NextResponse.json({ success: false, error: githubVal.error }, { status: 400 });
    }

    // 2. Validate PDF file
    if (!pdfFile) {
      return NextResponse.json(
        { success: false, error: "PDF submission is required." },
        { status: 400 }
      );
    }

    const pdfVal = validatePdfFile({
      name: pdfFile.name,
      size: pdfFile.size,
      type: pdfFile.type,
    });
    if (!pdfVal.isValid) {
      return NextResponse.json({ success: false, error: pdfVal.error }, { status: 400 });
    }

    const teamObjectId = new ObjectId(session.teamId);
    const submissionsCollection = await getSubmissionsCollection();

    // 3. Determine next submission number
    const previousSubmissionsCount = await submissionsCollection.countDocuments({
      teamId: teamObjectId,
    });
    const nextSubmissionNumber = previousSubmissionsCount + 1;

    // 4. Upload PDF to Supabase Storage
    const newSubmissionId = new ObjectId();
    const arrayBuffer = await pdfFile.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    let storagePath = "";
    try {
      const uploadRes = await uploadSubmissionPdf({
        fileBuffer,
        originalFilename: pdfFile.name,
        teamId: session.teamId,
        submissionId: newSubmissionId.toString(),
        contentType: pdfFile.type || "application/pdf",
      });
      storagePath = uploadRes.storagePath;
    } catch (uploadErr) {
      return NextResponse.json(
        {
          success: false,
          error: `Storage upload failed: ${(uploadErr as Error).message || "Please try again."}`,
        },
        { status: 500 }
      );
    }

    const now = new Date();

    // 5. Update previous submissions isLatest flag to false
    await submissionsCollection.updateMany(
      { teamId: teamObjectId },
      { $set: { isLatest: false } }
    );

    // 6. Insert new submission record
    await submissionsCollection.insertOne({
      _id: newSubmissionId,
      teamId: teamObjectId,
      teamName: session.teamName,
      submissionNumber: nextSubmissionNumber,
      pdfStoragePath: storagePath,
      pdfOriginalName: pdfFile.name,
      pdfSizeBytes: pdfFile.size,
      githubUrl: githubUrl!.trim(),
      submittedAt: now,
      isLatest: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Submission #${nextSubmissionNumber} uploaded successfully!`,
        submission: {
          id: newSubmissionId.toString(),
          submissionNumber: nextSubmissionNumber,
          pdfStoragePath: storagePath,
          pdfOriginalName: pdfFile.name,
          pdfSizeBytes: pdfFile.size,
          githubUrl: githubUrl!.trim(),
          submittedAt: now,
          isLatest: true,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const rawMessage = (err as Error).message || "An error occurred while saving the submission.";
    const sanitizedMessage = rawMessage.replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, "mongodb+srv://[REDACTED]@");
    return NextResponse.json({ success: false, error: sanitizedMessage }, { status: 500 });
  }
}
