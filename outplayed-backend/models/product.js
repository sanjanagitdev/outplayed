import mongoose from "mongoose";
const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Name is required!"],
    },
    price: {
      type: Number,
    },
    quantity:{
      type: Number,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    media: {
      type: Array,
    },
    steamcode: {
      type: String,
    },
    catid:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorys",
    },
    isredeem: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },
  },
  {
    timestamps: true,
  }
);
const productModel = mongoose.model("products", productSchema);
export default productModel;
