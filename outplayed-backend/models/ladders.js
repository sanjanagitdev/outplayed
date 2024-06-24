import mongoose from "mongoose";
const schema = mongoose.Schema;
const ladderSchema = new schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        banner: {
            type: String,
        },
        ladderStart: {
            type: Date,
            required: [true, "Starting Time is Required"],
        },
        ladderEndDate: {
            type: Date,
            required: [true, "End Time is Required"],
        },
        playerNumbers: {
            type: Number,
            required: [true, "Players are required"],
        },
        playerJoined: [
            {
                UserOrTeam: {
                    type: schema.Types.ObjectId,
                    refPath: "playerJoined.onModel",
                },
                onModel: {
                    type: String,
                    enum: ["users", "team"],
                },
            },
        ],
        gameType: {
            type: String,
            required: [true, "Ladder Game Type is Required"],
        },
        ladderPrize: {
            type: Number,
            required: [true, "Ladder prize is Required"],
        },
        createdBy: {
            type: schema.Types.ObjectId,
            refPath: "onModel",
        },
        onModel: {
            type: String,
            enum: ["users", "admin"],
        },
        ladderStarted: {
            type: Boolean,
            default: false,
        },
        ladderEnd: {
            type: Boolean,
            default: false,
        },
        ladderType: {
            type: String,
            default: "Normal",
        },
        ladderSummary: {
            type: String,
        },
        rooms: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "room",
            },
        ],
        challenges: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ladderchallenge",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const laddersModel = mongoose.model("ladder", ladderSchema);
export default laddersModel;
