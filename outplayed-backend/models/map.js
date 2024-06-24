import mongoose from "mongoose";
const mapSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "title required"],
        },
        imgurl: {
            type: String,
            required: [true, "imgurl required"],
        },
        open: {
            type: Boolean,
            default: true,
        },
        maptype: {
            type: String,
            required: [true, "Please provide map type"],
        },
        mapid: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);
const mapImageModel = mongoose.model("map", mapSchema);
export default mapImageModel;
