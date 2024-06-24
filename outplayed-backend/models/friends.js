import mongoose from "mongoose";
const friendsSchema = mongoose.Schema(
  {
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
      },
    ],
    bothfriends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const friendsModel = mongoose.model("friends", friendsSchema);
export default friendsModel;
