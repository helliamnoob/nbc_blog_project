const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  password: {
    type: Number,
    required: true,
  },
});
// Duplicate the ID field.
postSchema.virtual("postId").get(function () {
  return this._id.toHexString();
});
// Ensure virtual fields are serialised.
postSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Posts", postSchema);
