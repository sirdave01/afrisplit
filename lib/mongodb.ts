import mongoose from "mongoose";

interface MongooseCache {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ?? (global.mongooseCache = {
    connection: null,
    promise: null,
});

async function dbconnect(): Promise<typeof mongoose> {
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri) {
        throw new Error("Please define the MONGODB_URI environment variable");
    }

    if (cached.connection) {
        return cached.connection;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongodbUri, {
            bufferCommands: false,
        });
    }

    try {
        cached.connection = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.connection;
}

export default dbconnect;