import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getTeamsCollection } from "@/lib/mongodb";
import { getAuthenticatedTeam } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAuthenticatedTeam();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to your team portal." },
        { status: 401 }
      );
    }

    const teamsCollection = await getTeamsCollection();
    const team = await teamsCollection.findOne(
      { _id: new ObjectId(session.teamId) },
      { projection: { passwordHash: 0, teamNameLower: 0 } }
    );

    if (!team) {
      return NextResponse.json(
        { success: false, error: "Team account not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
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
