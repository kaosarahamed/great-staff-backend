const mongoose = require("mongoose");
const businessSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: Number,
    },
    Organization: {
      type: String,
    },
    profile: {
      type: String,
    },
    agreement: {
      type: Boolean,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("business", businessSchema);
