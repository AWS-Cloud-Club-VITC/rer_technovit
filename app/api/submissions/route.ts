import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSubmissionsCollection } from "@/lib/mongodb";
import { getAuthenticatedTeam } from "@/lib/auth";
import { validateGitHubUrl, validateDemoVideoUrl } from "@/lib/validation";

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
      demoVideoUrl: sub.demoVideoUrl,
      githubUrl: sub.githubUrl,
      submittedAt: sub.submittedAt,
      isLatest: index === 0,
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

    const body = await req.json();
    const githubUrl = body.githubUrl as string | null;
    const demoVideoUrl = body.demoVideoUrl as string | null;

    const githubVal = validateGitHubUrl(githubUrl ?? undefined);
    if (!githubVal.isValid) {
      return NextResponse.json({ success: false, error: githubVal.error }, { status: 400 });
    }

    const demoVal = validateDemoVideoUrl(demoVideoUrl ?? undefined);
    if (!demoVal.isValid) {
      return NextResponse.json({ success: false, error: demoVal.error }, { status: 400 });
    }

    const teamObjectId = new ObjectId(session.teamId);
    const submissionsCollection = await getSubmissionsCollection();

    const previousSubmissionsCount = await submissionsCollection.countDocuments({
      teamId: teamObjectId,
    });
    const nextSubmissionNumber = previousSubmissionsCount + 1;

    const now = new Date();

    await submissionsCollection.updateMany(
      { teamId: teamObjectId },
      { $set: { isLatest: false } }
    );

    const newSubmissionId = new ObjectId();
    await submissionsCollection.insertOne({
      _id: newSubmissionId,
      teamId: teamObjectId,
      teamName: session.teamName,
      submissionNumber: nextSubmissionNumber,
      demoVideoUrl: demoVideoUrl!.trim(),
      githubUrl: githubUrl!.trim(),
      submittedAt: now,
      isLatest: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Submission #${nextSubmissionNumber} created successfully!`,
        submission: {
          id: newSubmissionId.toString(),
          submissionNumber: nextSubmissionNumber,
          demoVideoUrl: demoVideoUrl!.trim(),
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
