import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getTeamsCollection, TeamMember } from "@/lib/mongodb";
import { hashPassword, signSessionToken, getSessionCookieOptions } from "@/lib/auth";
import {
  validateTeamName,
  validatePassword,
  validateMembers,
} from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { teamName, password, confirmPassword, members: membersRaw } = body;

    // 1. Basic validation
    const teamNameVal = validateTeamName(teamName);
    if (!teamNameVal.isValid) {
      return NextResponse.json({ success: false, error: teamNameVal.error }, { status: 400 });
    }

    const passwordVal = validatePassword(password);
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
    if (Array.isArray(membersRaw)) {
      members = membersRaw;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid team members format." },
        { status: 400 }
      );
    }

    const membersVal = validateMembers(members);
    if (!membersVal.isValid) {
      return NextResponse.json({ success: false, error: membersVal.error }, { status: 400 });
    }

    // 3. Check if team already exists in MongoDB
    const trimmedTeamName = teamName.trim();
    const teamNameLower = trimmedTeamName.toLowerCase();
    const teamsCollection = await getTeamsCollection();

    const existingTeam = await teamsCollection.findOne({ teamNameLower });
    if (existingTeam) {
      return NextResponse.json(
        { success: false, error: "Team name already exists." },
        { status: 409 }
      );
    }

    // 4. Hash password
    const passwordHash = await hashPassword(password);

    // 5. Insert Team in MongoDB
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

    // 6. Issue session cookie
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
