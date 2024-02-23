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
  updateEmployeePassword,
  updateEmployeeTasks,
} = require("../controllers/employee.controller");
const auth = require("../middlewares/auth");
const employeePic = require("../middlewares/employeePic");

router.get("/", auth, getEmployee);
router.get("/:id", auth, getOneEmployee);
router.post("/register", register);
router.post("/login", login);
router.post("/otp", otpSend);
router.post("/otp/check", otpCheck);
router.post("/reset/change", changePassword);
router.patch("/:id", auth, employeePic, updateEmployee);
router.patch("/password/:id", auth, updateEmployeePassword);
router.delete("/:id", auth, deleteEmployee);
router.patch("/tasks/:id", auth, updateEmployeeTasks);

module.exports = router;
