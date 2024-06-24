import mongoose from "mongoose";
const newsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title required"],
    },
    category: {
      type: String,
      required: [true, "category required"],
    },
    content: {
      type: String,
      required: [true, "content required"],
    },
    imgurl: {
      type: String,
      required: [true, "imgurl required"],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    likes: [
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
const newsModel = mongoose.model("news", newsSchema);
export default newsModel;
