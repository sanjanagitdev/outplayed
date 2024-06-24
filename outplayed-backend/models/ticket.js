import mongoose from "mongoose";
const Schema = mongoose.Schema;
const TicketSchema = new Schema(
    {
        subject: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "open",
        },
        description: {
            type: String,
            required: true,
        },
        attachment: {
            type: Array,
            default: [],
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        replies: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const TicketModel = mongoose.model("Tickets", TicketSchema);
export default TicketModel;
