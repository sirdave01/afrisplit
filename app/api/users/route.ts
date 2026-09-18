// This endpoint keeps the user record in sync with the current Pollar wallet.
// It creates the user if they are new, or updates the existing record if they
// return to the app and reconnect with the same wallet ID.


import { NextResponse } from "next/server";

import dbconnect from "@/lib/mongodb";

import User from "@/lib/models/User"


export async function POST(request: Request) {

    try {

        await dbconnect();

        const body = await request.json();

        const { pollarId, email, name } = body;

        if (!pollarId) {
            return NextResponse.json({ error: "pollarId is required" }, { status: 400 });
        }

        // upsert user (create if not exists)

        const user = await User.findOneAndUpdate(
            { pollarId },
            { pollarId, email, name },
            { upsert: true, returnDocument: "after" }
        );

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create/update user" }, { status: 500 });
    }
    
}