import mongoose from "mongoose";
const pruchesitemSchema = mongoose.Schema(
  {
    pid: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "products",
    },
    purchaseby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    phone:{
      type:String
    }, 
    town:{
      type:String
    },
    country:{
      type:String
    },
    province:{
      type:String
    },
    direction:{
      type:String
    },
  },
  {
    timestamps: true,
  }
);
const pruchesitemModel = mongoose.model("pruchesproduct", pruchesitemSchema);
export default pruchesitemModel;
