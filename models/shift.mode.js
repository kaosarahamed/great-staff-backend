const mongoose = require("mongoose");
const shiftSchema = mongoose.Schema(
  {
    startDate: {
      type: String,
    },
    startTime: {
      type: Number,
    },
    status: {
      type: String,
    },
    location: {
      type: String,
    },
    takenTime: {
      type: Number,
    },
    description: {
      type: String,
    },
    employeeID: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("shifts", shiftSchema);
