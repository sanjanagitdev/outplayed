import mongoose from "mongoose";
const notificationSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        reciver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        seen: {
            type: Boolean,
            default: false,
        },
        topic: {
            type: String,
        },
        type: {
            type: String,
        },
        state: {
            type: String,
            default: "primary",
        },
        teamid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "team",
        },
        roomid: {
            type: String,
        },
        customObjects: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);
const notificationModel = mongoose.model("notification", notificationSchema);
export default notificationModel;
