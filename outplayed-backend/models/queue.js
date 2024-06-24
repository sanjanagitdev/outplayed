import mongoose from "mongoose";
const Schema = mongoose.Schema;
const queueSchema = new Schema(
    {
        queuetype: {
            type: String,
        },
        gamemode: {
            type: String,
        },
        player: [
            {
                type: Schema.Types.ObjectId,
                ref: "users",
            },
        ],
        valid: {
            type: Boolean,
            default: true,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "group",
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "team",
        },
    },
    {
        timestamps: true,
    }
);
const queueModel = mongoose.model("queue", queueSchema);
export default queueModel;
