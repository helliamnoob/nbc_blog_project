const { ObjectId } = require("mongodb/lib/bson");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  _postId: {
    type: ObjectId,
    required: true,
    ref: "Posts",
  },
  user: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Comments", commentSchema);
