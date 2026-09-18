// This is the Mongoose schema and model for membership linking users to expense groups.

// the membership schema will reference both the user and group schemas to establish
// a many-to-many relationship between users and groups.

import mongoose, { Schema, models } from "mongoose";

const MembershipSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        groupId: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// preventing duplicate Membership
MembershipSchema.index({ userId: 1, groupId: 1 }, { unique: true });

const Membership = models.Membership || mongoose.model("Membership", MembershipSchema);

export default Membership;
