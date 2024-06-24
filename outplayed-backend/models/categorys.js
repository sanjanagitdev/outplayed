import mongoose from "mongoose";
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
  },
  {
    timestamps: true,
  }
);
const categoryModel = mongoose.model("categorys", categorySchema);
export default categoryModel;

