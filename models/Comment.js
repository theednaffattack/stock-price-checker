const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const commentSchema = new mongoose.Schema(
  {
    text: { type: String },
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
  },
  {
    timestamps: true // created_at, updatedAt
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment, commentSchema };
