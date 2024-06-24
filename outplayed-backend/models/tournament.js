import mongoose from "mongoose";
const schema = mongoose.Schema;
const tournamentSchema = new schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        banner: {
            type: String,
        },
        tournamentStart: {
            type: Date,
            required: [true, "Starting Time is Required"],
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
            required: [true, "Tournament Game Type is Required"],
        },
        tournamentPrize: {
            type: Number,
            required: [true, "Tournament prize is Required"],
        },
        Winner: {
            type: schema.Types.ObjectId,
            ref: "users",
        },
        createdBy: {
            type: schema.Types.ObjectId,
            refPath: "onModel",
        },
        onModel: {
            type: String,
            enum: ["users", "admin"],
        },
        roomsLevelOne: [
            {
                type: schema.Types.ObjectId,
                ref: "room",
            },
        ],
        roomsLevelTwo: [
            {
                type: schema.Types.ObjectId,
                ref: "room",
            },
        ],
        roomsLevelThree: [
            {
                type: schema.Types.ObjectId,
                ref: "room",
            },
        ],
        roomsLevelFour: [
            {
                type: schema.Types.ObjectId,
                ref: "room",
            },
        ],
        roomsLevelFive: [
            {
                type: schema.Types.ObjectId,
                ref: "room",
            },
        ],
        roomsLevelSix: [
            {
                type: schema.Types.ObjectId,
                ref: "room",
            },
        ],
        roomsLevelSeven: [
            {
                type: schema.Types.ObjectId,
                ref: "room",
            },
        ],
        tournamentStarted: {
            type: Boolean,
            default: false,
        },
        tournamentEnd: {
            type: Boolean,
            default: false,
        },
        tournamentType: {
            type: String,
            default: "Normal",
        },
        tournamentSummary: {
            type: String,
        },
        checkedInPlayers: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const tournamentModel = mongoose.model("tournament", tournamentSchema);
export default tournamentModel;
