import mongoose from "mongoose";
const Schema = mongoose.Schema;
//creating mongo database schema
const serverSchema = new Schema({
    ip: {
        type: String,
        required: [true, "ip required"],
    },
    port: {
        type: Number,
        required: [true, "port required"],
    },
    status: {
        type: Boolean,
        default: true,
    },
    rconpassword: {
        type: String,
        required: [true, "rcon password required"],
    },
    sshuser: {
        type: String,
        required: [true, "ssh user required"],
    },
    sshpassword: {
        type: String,
        required: [true, "sshpassword required"],
    },
    servertype: {
        type: String,
        required: [true, "server type required"],
    },
});
const serverModel = mongoose.model("servers", serverSchema);
export default serverModel;
