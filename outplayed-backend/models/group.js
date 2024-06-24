import mongoose from "mongoose";
const Schema = mongoose.Schema;
const groupSchema = new Schema({
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
    members: {
        type: Array,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
});
const groupModel = mongoose.model("group", groupSchema);
export default groupModel;
