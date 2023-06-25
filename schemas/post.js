const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
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
