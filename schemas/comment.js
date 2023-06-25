const { ObjectId } = require("mongodb/lib/bson");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: ObjectId,
    required: true,
    ref: "Posts",
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Comments", commentSchema);
