import mongoose from "mongoose";
const JoinForPlaySchema = mongoose.Schema(
    {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        hubid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hubs",
        },
        result: {
            type: mongoose.Schema.Types.Mixed,
        },
        running: {
            type: Boolean,
            default: true,
        },
        iscaptain: {
            type: Boolean,
            default: false,
        },
        chance: {
            type: Boolean,
            default: false,
        },
        ready: {
            type: Boolean,
            default: false,
        },
        jointype: {
            type: String,
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

const joinForPlayModel = mongoose.model("joinforplay", JoinForPlaySchema);
export default joinForPlayModel;
