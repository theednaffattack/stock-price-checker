const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const issueSchema = new mongoose.Schema(
  {
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    project: { type: String, required: true },
    open: { type: Boolean, default: true },
    assigned_to: { type: String },
    status_text: { type: String }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

const Issue = mongoose.model("Issue", issueSchema);

module.exports = { Issue, issueSchema };
