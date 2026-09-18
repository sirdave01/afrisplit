// This is the group Mongoose schema and model representing an expense group.

// the group schema will reference the user schema to establish a relationship between groups and users. 
// Each group will have a name, an optional description, and a reference to the user who created it. 
// The schema will also include timestamps to track when each group was created and last updated.

import mongoose, {Schema, models} from "mongoose";

const GroupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
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
