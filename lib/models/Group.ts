// This Mongoose model represents a shared expense group.
// Each group is tied to a creator user and can optionally store a default African
// currency so all members see a consistent pricing view for the group.

import mongoose, { Schema, models } from "mongoose";

const AFRICAN_CURRENCIES = [
    "NGN",
    "KES",
    "GHS",
    "ZAR",
    "XAF",
    "XOF",
    "TZS",
    "UGX",
    "RWF",
    "MAD",
    "EGP",
    "CDF",
    "BWP",
];

const GroupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        currency: {
            type: String,
            enum: AFRICAN_CURRENCIES,
            default: "NGN",
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
const Group = models.Group || mongoose.model("Group", GroupSchema);

export default Group;
