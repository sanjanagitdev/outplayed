import mongoose from "mongoose";
const roomSchema = mongoose.Schema(
    {
        team1: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "joinforplay",
            },
        ],
        team2: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "joinforplay",
            },
        ],
        running: {
            type: Boolean,
            default: true,
        },
        cancelled: {
            type: Boolean,
            default: false,
        },
        teamone: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "chats",
            },
        ],
        teamtwo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "chats",
            },
        ],
        map: {
            type: String,
        },
        joinip: {
            type: String,
        },
        mapvoting: {
            type: String,
            default: "false",
        },
        maps: {
            type: Array,
            default: [],
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "comment",
            },
        ],
        gametype: {
            type: String,
        },
        gamemode: {
            type: String,
        },
        istournament: {
            type: Boolean,
            default: false,
        },
        tournamentid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tournament",
        },
        ladderid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ladder",
        },
        ladderChallengeAt: {
            type: Date,
        },
        thumbs: {
            type: Array,
            default: [],
        },
        reports: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "gamereport",
            },
        ],
        minutescheck: {
            type: Number,
            default: 300,
        },
    },
    {
        timestamps: true,
    }
);
const roomModel = mongoose.model("room", roomSchema);
export default roomModel;
