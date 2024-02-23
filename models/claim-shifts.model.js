const mongoose = require("mongoose");
const claimShiftsSchema = mongoose.Schema(
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
    employeeId: {
      type: String,
    },
    requirements: {
      type: String,
    },
    status: {
      type: String,
    },
    shiftId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("claim-shift", claimShiftsSchema);
