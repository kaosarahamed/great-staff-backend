const mongoose = require("mongoose");
const clientSchema = mongoose.Schema(
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
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("client", clientSchema);
