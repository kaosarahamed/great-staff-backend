const express = require("express");
const router = express.Router();
const {
  getEmployee,
  getOneEmployee,
  register,
  login,
  otpCheck,
  otpSend,
  changePassword,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");
const auth = require("../middlewares/auth");
const employeePic = require("../middlewares/employeePic");

router.get("/", auth, getEmployee);
router.get("/:id", auth, getOneEmployee);
router.post("/register", register);
router.post("/login", auth, login);
router.post("/otp", otpSend);
router.post("/otp/check", otpCheck);
router.post("/reset/:id", changePassword);
router.patch("/:id", auth, employeePic, updateEmployee);
router.delete("/:id", auth, deleteEmployee);

module.exports = router;
