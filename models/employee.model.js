const mongoose = require("mongoose");
const employeeSchema = mongoose.Schema(
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
    address: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    profile: {
      type: String,
    },
    agreement: {
      type: Boolean,
    },
    bio: {
      type: String,
    },
    totalHour: {
      type: Number,
    },
    totalShiftComplete: {
      type: Number,
    },
    totalCompensation: {
      type: Number,
    },
    currentCompensation: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("employee", employeeSchema);
