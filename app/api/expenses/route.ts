// Reserved for API operations that create and retrieve group expenses.

import { NextResponse } from "next/server";

import dbconnect from "@/lib/mongodb";

import Expense from "@/lib/models/Expense";

import User from "@/lib/models/User";

import Membership from "@/lib/models/Membership";

export async function POST(request: Request) {

    try {

        await dbconnect();

        const body = await request.json();

        const { groupId, title, amount, pollarId, memberIds } = body;

        if (!groupId || !title || !amount || !pollarId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return NextResponse.json({ error: "Amount must be greater than zero" }, { status: 400 });
        }

        const paidByUser = await User.findOne({ pollarId });

        if (!paidByUser) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        // Get all members of the group

        const memberships = await Membership.find({ groupId });

        const allMemberIds = memberships.map((m) => m.userId.toString());

        // if memberIds not provided, split equally among all members

        const targets = memberIds && memberIds.length > 0 ? memberIds : allMemberIds;

        if (targets.length === 0) {
            return NextResponse.json({ error: "Add at least one group member first" }, { status: 400 });
        }

        const shareAmount = numericAmount / targets.length;

        const shares = targets.map((userId: string) => ({
            userId,
            amount: shareAmount,
            paid: userId === paidByUser._id.toString(),
        }));

        const expense = await Expense.create({
            groupId,
            title,
            amount: numericAmount,
            paidBy: paidByUser._id,
            shares,
        });

        return NextResponse.json(expense, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create Expense" }, { status: 500 });
    }
}

