import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 120
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240
    },
    content: {
      type: String,
      required: true,
      minlength: 20
    },
    coverImage: {
      type: String,
      default: ""
    },
    tags: {
      type: [String],
      default: []
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
