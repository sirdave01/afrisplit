// Reserved for API operations on one expense group identified by its ID.

import { NextResponse } from "next/server";

import dbconnect from "@/lib/mongodb";

import Group from "@/lib/models/Group";

import Expense from "@/lib/models/Expense";

import Membership from "@/lib/models/Membership";

export async function GET(

    request: Request,

    { params }: { params: Promise<{ Id: string }> }
) {
    try {
        await dbconnect();

        const { Id } = await params;

        const group = await Group.findById(Id);

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        const expenses = await Expense.find({ groupId: Id })
            .populate("paidBy", "name email pollarId")
            .sort({ createdAt: -1 });
        
        const members = await Membership.find({ groupId: Id }).populate("userId", "name email pollarId");

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