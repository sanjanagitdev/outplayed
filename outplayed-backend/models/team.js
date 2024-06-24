import mongoose from "mongoose";
const Schema = mongoose.Schema;
const teamSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        invitedmembers: [
            {
                ref: "users",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        joinedmembers: [
            {
                ref: "users",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        tag: {
            type: String,
        },
        teamlogo: {
            type: String,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        country: {
            type: Schema.Types.Mixed,
        },
        isCaptain:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        tournaments: [
            {
                type: Schema.Types.ObjectId,
                ref: "tournament",
            },
        ],
    },
    {
        timestamps: true,
    }
);
const teamModel = mongoose.model("team", teamSchema);
export default teamModel;
