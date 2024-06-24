import mongoose from "mongoose";
const scoutingAreaSchema = mongoose.Schema(
    {
        joinedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        language: {
            type: Array,
            default: [],
        },
        description: {
            type: String,
        },
        roles: {
            type: Array,
            default: [],
        },
        isdisappears:{
            type:Date
        }, 
        incomingRequests: [
            {
                contactBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "users",
                },
                contactedAt: {
                    type: Date,
                },
                messages: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "chats",
                    },
                ],
                roomId: {
                    type: String,
                },
                isActive: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);
const scoutingAreaModel = mongoose.model("scoutingarea", scoutingAreaSchema);
export default scoutingAreaModel;
