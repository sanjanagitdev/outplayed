import mongoose from 'mongoose';
const postSchema = mongoose.Schema(
  {
    postedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    cool: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    funny: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    wow: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    angry: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    content: {
      type: String,
    },
    images: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);
const postModel = mongoose.model('posts', postSchema);
export default postModel;
