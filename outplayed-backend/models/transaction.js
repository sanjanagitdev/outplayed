import mongoose from "mongoose";
const transactionSchema = mongoose.Schema(
    {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        transaction_data: {
            type: mongoose.Schema.Types.Mixed,
        },
        transaction_type: {
            type: String,
            required: false,
        },
        total: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);
const transactionModel = mongoose.model("transaction", transactionSchema);
export default transactionModel;
