const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const stockSchema = new mongoose.Schema(
  {
    stock: { type: String, unique: true, index: true },
    price: Number,
    IPAdresses: [{ type: String }]
  },
  {
    timestamps: true // created_at, updatedAt
  }
);
// Apply the uniqueValidator plugin to userSchema.
stockSchema.plugin(uniqueValidator);

const Stock = mongoose.model("Stock", stockSchema);

module.exports = { Stock, stockSchema };
