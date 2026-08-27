import { NextRequest, NextResponse } from "next/server";
import { getTeamsCollection } from "@/lib/mongodb";
import { verifyPassword, signSessionToken, getSessionCookieOptions } from "@/lib/auth";
import { validateTeamName, validatePassword } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { teamName, password } = body;

    const teamNameVal = validateTeamName(teamName);
    if (!teamNameVal.isValid) {
      return NextResponse.json({ success: false, error: teamNameVal.error }, { status: 400 });
    }

    const passwordVal = validatePassword(password);
    if (!passwordVal.isValid) {
      return NextResponse.json({ success: false, error: passwordVal.error }, { status: 400 });
    }

    const trimmedTeamName = teamName.trim();
    const teamNameLower = trimmedTeamName.toLowerCase();
    const teamsCollection = await getTeamsCollection();

    const team = await teamsCollection.findOne({ teamNameLower });
    if (!team) {
      return NextResponse.json(
        { success: false, error: "Invalid team name or password." },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, team.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid team name or password." },
        { status: 401 }
      );
    }

    // Sign session token
    const token = await signSessionToken({
      teamId: team._id!.toString(),
      teamName: team.teamName,
    });

    const cookieOptions = getSessionCookieOptions();
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful!",
        team: {
          teamId: team._id!.toString(),
          teamName: team.teamName,
          members: team.members,
        },
      },
      { status: 200 }
    );

    response.cookies.set(cookieOptions.name, token, cookieOptions);
    return response;
  } catch (err) {
    const rawMessage = (err as Error).message || "An unexpected error occurred during login.";
    const sanitizedMessage = rawMessage.replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, "mongodb+srv://[REDACTED]@");
    return NextResponse.json({ success: false, error: sanitizedMessage }, { status: 500 });
  }
}
