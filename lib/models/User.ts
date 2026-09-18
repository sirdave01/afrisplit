// The user model stores the wallet-based identity used by the app.
// We keep a Pollar wallet ID as the main unique key and also store optional
// profile data such as email and display name for a better group experience.

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
