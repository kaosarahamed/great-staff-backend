const mongoose = require("mongoose");
const jobSchema = mongoose.Schema(
  {
    startDate: {
      type: String,
    },
    startTime: {
      type: Number,
    },
    postDate: {
      type: String,
    },
    length: {
      type: Number,
    },
    urgency: {
      type: String,
    },
    compensation: {
      type: Number,
    },
    bonuses: {
      type: Number,
    },
    notes: {
      type: String,
    },
    employeeID: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("job", jobSchema);
