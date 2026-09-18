// this route file routes the db to the user models to get response
// from next server to connecting with the database and getting the required information


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
            { upsert: true, new: true }
        );

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create/update user" }, { status: 500 });
    }
    
}