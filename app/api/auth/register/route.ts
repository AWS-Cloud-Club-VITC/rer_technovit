import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getTeamsCollection, getSubmissionsCollection, TeamMember } from "@/lib/mongodb";
import { hashPassword, signSessionToken, getSessionCookieOptions } from "@/lib/auth";
import { uploadSubmissionPdf } from "@/lib/supabase";
import {
  validateTeamName,
  validatePassword,
  validateMembers,
  validateGitHubUrl,
  validatePdfFile,
} from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const teamName = formData.get("teamName") as string | null;
    const password = formData.get("password") as string | null;
    const confirmPassword = formData.get("confirmPassword") as string | null;
    const membersRaw = formData.get("members") as string | null;
    const githubUrl = formData.get("githubUrl") as string | null;
    const pdfFile = formData.get("pdf") as File | null;

    // 1. Basic validation
    const teamNameVal = validateTeamName(teamName ?? undefined);
    if (!teamNameVal.isValid) {
      return NextResponse.json({ success: false, error: teamNameVal.error }, { status: 400 });
    }

    const passwordVal = validatePassword(password ?? undefined);
    if (!passwordVal.isValid) {
      return NextResponse.json({ success: false, error: passwordVal.error }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match." },
        { status: 400 }
      );
    }

    // 2. Members validation
    let members: TeamMember[] = [];
    try {
      if (!membersRaw) throw new Error("Missing members");
      members = JSON.parse(membersRaw);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid team members format." },
        { status: 400 }
      );
    }

    const membersVal = validateMembers(members);
    if (!membersVal.isValid) {
      return NextResponse.json({ success: false, error: membersVal.error }, { status: 400 });
    }

    // 3. GitHub URL validation
    const githubVal = validateGitHubUrl(githubUrl ?? undefined);
    if (!githubVal.isValid) {
      return NextResponse.json({ success: false, error: githubVal.error }, { status: 400 });
    }

    // 4. PDF File validation
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

    // 5. Check if team already exists in MongoDB
    const trimmedTeamName = teamName!.trim();
    const teamNameLower = trimmedTeamName.toLowerCase();
    const teamsCollection = await getTeamsCollection();

    const existingTeam = await teamsCollection.findOne({ teamNameLower });
    if (existingTeam) {
      return NextResponse.json(
        { success: false, error: "Team name already exists." },
        { status: 409 }
      );
    }

    // 6. Hash password
    const passwordHash = await hashPassword(password!);

    // 7. Insert Team in MongoDB
    const teamId = new ObjectId();
    const cleanMembers = members.map((m) => ({
      name: m.name.trim(),
      regNo: m.regNo.trim().toUpperCase(),
    }));

    const now = new Date();
    await teamsCollection.insertOne({
      _id: teamId,
      teamName: trimmedTeamName,
      teamNameLower,
      passwordHash,
      members: cleanMembers,
      createdAt: now,
      updatedAt: now,
    });

    // 8. Upload PDF to Supabase Storage
    const submissionId = new ObjectId();
    const arrayBuffer = await pdfFile.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    let storagePath = "";
    try {
      const uploadRes = await uploadSubmissionPdf({
        fileBuffer,
        originalFilename: pdfFile.name,
        teamId: teamId.toString(),
        submissionId: submissionId.toString(),
        contentType: pdfFile.type || "application/pdf",
      });
      storagePath = uploadRes.storagePath;
    } catch (uploadErr) {
      // Rollback team creation if storage upload failed
      await teamsCollection.deleteOne({ _id: teamId });
      return NextResponse.json(
        {
          success: false,
          error: `Storage upload failed: ${(uploadErr as Error).message || "Please try again."}`,
        },
        { status: 500 }
      );
    }

    // 9. Record first submission in MongoDB
    const submissionsCollection = await getSubmissionsCollection();
    await submissionsCollection.insertOne({
      _id: submissionId,
      teamId,
      teamName: trimmedTeamName,
      submissionNumber: 1,
      pdfStoragePath: storagePath,
      pdfOriginalName: pdfFile.name,
      pdfSizeBytes: pdfFile.size,
      githubUrl: githubUrl!.trim(),
      submittedAt: now,
      isLatest: true,
    });

    // 10. Issue session cookie
    const token = await signSessionToken({
      teamId: teamId.toString(),
      teamName: trimmedTeamName,
    });

    const cookieOptions = getSessionCookieOptions();
    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        team: {
          teamId: teamId.toString(),
          teamName: trimmedTeamName,
          members: cleanMembers,
        },
      },
      { status: 201 }
    );

    response.cookies.set(cookieOptions.name, token, cookieOptions);
    return response;
  } catch (err) {
    const rawMessage = (err as Error).message || "An unexpected error occurred during registration.";
    const sanitizedMessage = rawMessage.replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, "mongodb+srv://[REDACTED]@");
    return NextResponse.json({ success: false, error: sanitizedMessage }, { status: 500 });
  }
}
