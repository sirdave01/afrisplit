// this is the general groups routes that responds with the information from the database

import { NextResponse } from "next/server";

import dbconnect from "@/lib/mongodb";

import Group from "@/lib/models/Group";

import Membership from "@/lib/models/Membership";

import User from "@/lib/models/User";


export async function GET(request: Request) {

    try {

        await dbconnect();

        const { searchParams } = new URL(request.url);

        const pollarId = searchParams.get("pollarId");

        if (!pollarId) {
            return NextResponse.json({ error: "pollarId is required" }, { status: 400 });
        }

        const currentUser = await User.findOne({ pollarId });

        if (!currentUser) {
            return NextResponse.json([]);
        }

        const memberships = await Membership.find({ userId: currentUser._id }).populate("groupId");

        const groups = memberships.map((membership) => membership.groupId);

        return NextResponse.json(groups);

    } catch (error) {

        console.error(error);

        return NextResponse.json({error: "failed to fetch groups"}, {status: 500})
        
    }

}

export async function POST(request: Request) {

    try {
        
        await dbconnect();

        const body = await request.json();

        const { name, description, pollarId, currency } = body;

        if (!name || !pollarId) {
            return NextResponse.json({ error: "name and pollarId are required" }, { status: 400 });
        }

        const validCurrency = typeof currency === "string" ? currency.toUpperCase() : "NGN";
        const allowedCurrencies = ["NGN", "KES", "GHS", "ZAR", "XAF", "XOF", "TZS", "UGX", "RWF", "MAD", "EGP", "CDF", "BWP"];

        if (!allowedCurrencies.includes(validCurrency)) {
            return NextResponse.json({ error: "Unsupported currency. Please choose an African currency." }, { status: 400 });
        }

        // Find or create User

        let user = await User.findOne({ pollarId });

        if (!user) {
            user = await User.create({ pollarId });
        }

        // create group

        const group = await Group.create({
            name,
            description,
            currency: validCurrency,
            createdBy: user._id,
        });

        // Add creator as owner of the group

        await Membership.create({
            userId: user._id,
            groupId: group._id,
        });

        return NextResponse.json(group, { status: 201 });
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create group" }, {status: 500});
    }
}