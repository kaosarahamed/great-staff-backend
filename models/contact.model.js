const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
    messages: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("contact", contactSchema);
