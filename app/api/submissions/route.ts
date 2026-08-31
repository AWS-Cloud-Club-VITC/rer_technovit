import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSubmissionsCollection } from "@/lib/mongodb";
import { getAuthenticatedTeam } from "@/lib/auth";
import { validateGitHubUrl, validateDemoVideoUrl, validateRoundNumber, validateBuilderAlias } from "@/lib/validation";

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

    const formatted = teamSubmissions.map((sub) => ({
      id: sub._id!.toString(),
      submissionNumber: sub.submissionNumber,
      roundNumber: sub.roundNumber || 1,
      demoVideoUrl: sub.demoVideoUrl,
      githubUrl: sub.githubUrl,
      builderAlias: sub.builderAlias,
      submittedAt: sub.submittedAt,
      isLatest: sub.isLatest ?? false,
    }));

    // Group latest submission by round
    const latestByRound: Record<number, typeof formatted[0] | null> = {
      1: formatted.find((s) => s.roundNumber === 1 && s.isLatest) || formatted.find((s) => s.roundNumber === 1) || null,
      2: formatted.find((s) => s.roundNumber === 2 && s.isLatest) || formatted.find((s) => s.roundNumber === 2) || null,
    };

    return NextResponse.json(
      {
        success: true,
        submissions: formatted,
        latestSubmission: formatted[0] || null,
        latestByRound,
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
    const roundNumber = Number(body.roundNumber || 1);
    const githubUrl = body.githubUrl as string | null;
    const demoVideoUrl = body.demoVideoUrl as string | null;
    const builderAlias = body.builderAlias as string | null;

    const roundVal = validateRoundNumber(roundNumber);
    if (!roundVal.isValid) {
      return NextResponse.json({ success: false, error: roundVal.error }, { status: 400 });
    }

    const githubVal = validateGitHubUrl(githubUrl ?? undefined);
    if (!githubVal.isValid) {
      return NextResponse.json({ success: false, error: githubVal.error }, { status: 400 });
    }

    const demoVal = validateDemoVideoUrl(demoVideoUrl ?? undefined);
    if (!demoVal.isValid) {
      return NextResponse.json({ success: false, error: demoVal.error }, { status: 400 });
    }

    if (roundNumber === 2) {
      const aliasVal = validateBuilderAlias(builderAlias ?? undefined);
      if (!aliasVal.isValid) {
        return NextResponse.json({ success: false, error: aliasVal.error }, { status: 400 });
      }
    }

    const teamObjectId = new ObjectId(session.teamId);
    const submissionsCollection = await getSubmissionsCollection();

    const previousSubmissionsCount = await submissionsCollection.countDocuments({
      teamId: teamObjectId,
    });
    const nextSubmissionNumber = previousSubmissionsCount + 1;

    const now = new Date();

    // Mark previous submissions for this team and this round as isLatest: false
    await submissionsCollection.updateMany(
      { teamId: teamObjectId, roundNumber },
      { $set: { isLatest: false } }
    );

    const trimmedAlias = builderAlias ? builderAlias.trim() : undefined;

    const newSubmissionId = new ObjectId();
    await submissionsCollection.insertOne({
      _id: newSubmissionId,
      teamId: teamObjectId,
      teamName: session.teamName,
      submissionNumber: nextSubmissionNumber,
      roundNumber,
      demoVideoUrl: demoVideoUrl!.trim(),
      githubUrl: githubUrl!.trim(),
      ...(trimmedAlias ? { builderAlias: trimmedAlias } : {}),
      submittedAt: now,
      isLatest: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Submission #${nextSubmissionNumber} for Round ${roundNumber} created successfully!`,
        submission: {
          id: newSubmissionId.toString(),
          submissionNumber: nextSubmissionNumber,
          roundNumber,
          demoVideoUrl: demoVideoUrl!.trim(),
          githubUrl: githubUrl!.trim(),
          builderAlias: trimmedAlias,
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
