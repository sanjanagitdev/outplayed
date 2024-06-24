//imports
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
//creating mongo database schema
const commentSchema = new Schema(
  {
    commentby: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    comment: {
      type: String,
      required: [true, 'please enter the text'],
    },
    date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
const commentModel = mongoose.model('comment', commentSchema);
export default commentModel;
