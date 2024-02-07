const mongoose = require("mongoose");
const employeeSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      unique: true,
    },
    lastName: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      unique: true,
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
    Organization: {
      type: String,
    },
    profile: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("employee", employeeSchema);
