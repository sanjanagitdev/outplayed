import mongoose from "mongoose";
const ladderChallengeSchema = mongoose.Schema(
    {
        challengeBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },

        challengeTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },

        dateTime: {
            type: Date,
        },
        isValid: {
            type: Boolean,
            default: true,
        },
        state: {
            type: String,
            default: "primary",
        },
        ladderid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ladder",
        },
        gameType: {
            type: String,
        },
        teamIds: {
            type: Array,
            default: [],
        },
        roomid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "room",
        },
    },
    {
        timestamps: true,
    }
);
const ladderChallengeModel = mongoose.model("ladderchallenge", ladderChallengeSchema);
export default ladderChallengeModel;
