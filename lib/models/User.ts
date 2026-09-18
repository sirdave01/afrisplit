// The Mongoose schema and model representing an 
// AfriSplit user will be wrapped around Pollar with PollarId

import mongoose, {Schema, models} from "mongoose";

const userSchema = new Schema(
    {
        pollarId: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
        },
        name: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const user = models.User || mongoose.model("User", userSchema);

export default user;
