import mongoose from "mongoose";
const HubsSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        premium: {
            type: Boolean,
            default: false,
        },
        premiumadvanced: {
            type: Boolean,
            default: false,
        },
        prestige: {
            //Its called elo rating
            type: String,
            required: true,
        },
        joinedplayers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "joinforplay",
            },
        ],
        team1: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "joinforplay",
                isCaptain: false,
            },
        ],
        team2: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "joinforplay",
                isCaptain: false,
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
        createdby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        chats: [
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
        checkfull: {
            type: String,
            default: "false",
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
        byadmin: {
            type: Boolean,
            default: false,
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

const hubsModel = mongoose.model("hubs", HubsSchema);
export default hubsModel;
