import mongoose from "mongoose";
const gameReportSchema = mongoose.Schema(
    {
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },

        reportedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        category: {
            type: String,
            default: "others",
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
const gameReportModel = mongoose.model("gamereport", gameReportSchema);
export default gameReportModel;
