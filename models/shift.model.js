const mongoose = require("mongoose");
const shiftSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    startDate: {
      type: String,
    },
    startTime: {
      type: String,
    },
    urgency: {
      type: String,
    },
    location: {
      type: Object,
    },
    length: {
      type: Number,
    },
    compensation: {
      type: Number,
    },
    bonus: {
      type: Number,
    },
    description: {
      type: String,
    },
    creatorId: {
      type: String,
    },
    requirements: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("shifts", shiftSchema);
