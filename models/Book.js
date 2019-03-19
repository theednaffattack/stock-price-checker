const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
  },
  {
    timestamps: true // created_at, updatedAt
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = { Book, bookSchema };
