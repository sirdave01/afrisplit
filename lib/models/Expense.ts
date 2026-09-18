// this is the expense schema that shares the expenses; reference the user Schema,
// reference the group schema and creates data for the shared bils and who paid

import mongoose, { Schema, models } from "mongoose";

const ExpenseShareSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paid: {
        type: Boolean,
        default: false
    },
});

const ExpenseSchema = new Schema(
    {
        groupId: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        paidBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        shares: [ExpenseShareSchema],
    },
    { timestamps: true }
);

const Expense = models.Expense || mongoose.model("Expense", ExpenseSchema);

export default Expense