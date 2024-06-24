import mongoose from "mongoose";
const Schema = mongoose.Schema;
const withdrawSchema = new Schema(
    {
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        dob: {
            type: Date,
        },
        street: {
            type: String,
            required: true,
        },
        zipcodeCity: {
            type: String,
            required: true,
        },
        country: {
            type: Schema.Types.Mixed,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        requestedBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        amount: {
            type: Number,
            required: true,
        },
        approved: {
            type: Boolean,
            default: false,
        },
        payout: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

const withdrawModel = mongoose.model("withdraw", withdrawSchema);
export default withdrawModel;
