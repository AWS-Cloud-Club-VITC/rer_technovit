import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getTeamsCollection } from "@/lib/mongodb";
import { getAuthenticatedTeam, getSessionCookieOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAuthenticatedTeam();
    if (!session) {
      return NextResponse.json(
        { success: true, authenticated: false, team: null },
        { status: 200 }
      );
    }

    let team = null;
    try {
      if (ObjectId.isValid(session.teamId)) {
        const teamsCollection = await getTeamsCollection();
        team = await teamsCollection.findOne(
          { _id: new ObjectId(session.teamId) },
          { projection: { passwordHash: 0, teamNameLower: 0 } }
        );
      }
    } catch {
      // Database or parsing error
    }

    if (!team) {
      // Stale session cookie pointing to a missing team: clear cookie and return authenticated: false
      const cookieOptions = getSessionCookieOptions();
      const res = NextResponse.json(
        { success: true, authenticated: false, team: null },
        { status: 200 }
      );
      res.cookies.set(cookieOptions.name, "", {
        ...cookieOptions,
        maxAge: 0,
      });
      return res;
    }

    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        team: {
          teamId: team._id!.toString(),
          teamName: team.teamName,
          members: team.members,
          createdAt: team.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    const rawMessage = (err as Error).message || "Failed to fetch team data.";
    const sanitizedMessage = rawMessage.replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, "mongodb+srv://[REDACTED]@");
    return NextResponse.json({ success: false, error: sanitizedMessage }, { status: 500 });
  }
}
