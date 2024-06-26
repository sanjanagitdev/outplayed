import mongoose from "mongoose";
const chatSchema = mongoose.Schema(
  {
    sendby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    message: {
      type: String,
      required: [true, "Message should be required"],
      minlength: [0, "message should be greater than 0 characters"],
      maxlength: [100, "message should be less than 15 characters"],
    },
  },
  {
    timestamps: true,
  }
);
const chatModel = mongoose.model("chats", chatSchema);
export default chatModel;
