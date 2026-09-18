// This route allows a group owner or any authenticated member to add another
// user to the current group by email or wallet identifier. It uses the same
// membership model already used when a group is first created.

import { NextResponse } from "next/server";
import dbconnect from "@/lib/mongodb";
import Membership from "@/lib/models/Membership";
import User from "@/lib/models/User";

export async function POST(request: Request, { params }: { params: Promise<{ groupId: string }> }) {
  try {
    await dbconnect();

    const { groupId } = await params;
    const body = await request.json();
    const identifier = typeof body?.identifier === "string" ? body.identifier.trim() : "";

    if (!groupId || !identifier) {
      return NextResponse.json({ error: "Group ID and member identifier are required." }, { status: 400 });
    }

    // Find an existing user using either their Pollar wallet id or email.
    const user = await User.findOne({
      $or: [
        { pollarId: identifier },
        { email: identifier },
      ],
    });

    if (!user) {
      return NextResponse.json({ error: "User not found. Ask them to sign in first." }, { status: 404 });
    }

    // Prevent duplicate memberships; the schema already indexes userId + groupId.
    const membership = await Membership.findOneAndUpdate(
      { groupId, userId: user._id },
      { groupId, userId: user._id },
      { upsert: true, new: true }
    );

    return NextResponse.json({ membership }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add member to group." }, { status: 500 });
  }
}
