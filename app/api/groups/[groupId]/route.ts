// This route returns the full details for a single group, including:
// - the group metadata
// - all member records attached to the group
// - all expenses that belong to the group

import { NextResponse } from "next/server";
import dbconnect from "@/lib/mongodb";
import Group from "@/lib/models/Group";
import Expense from "@/lib/models/Expense";
import Membership from "@/lib/models/Membership";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    await dbconnect();

    const { groupId } = await params;
    const group = await Group.findById(groupId);

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const expenses = await Expense.find({ groupId })
      .populate("paidBy", "name email pollarId")
      .sort({ createdAt: -1 });

    const members = await Membership.find({ groupId }).populate("userId", "name email pollarId");

    return NextResponse.json({
      group,
      expenses,
      members,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch group" }, { status: 500 });
  }
}
