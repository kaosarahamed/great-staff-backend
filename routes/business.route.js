const express = require("express");
const router = express.Router();
const {
  getBusiness,
  getOneBusiness,
  register,
  login,
  otpCheck,
  changePassword,
  deleteBusiness,
  updateBusinessPassword,
  updateBusiness,
  otpSend,
} = require("../controllers/businee.controller");
const auth = require("../middlewares/auth");
const employeePic = require("../middlewares/employeePic");

router.get("/", auth, getBusiness);
router.get("/:id", auth, getOneBusiness);
router.post("/register", register);
router.post("/login", login);
router.post("/otp", otpSend);
router.post("/otp/check", otpCheck);
router.post("/reset/change", changePassword);
router.patch("/:id", auth, employeePic, updateBusiness);
router.patch("/password/:id", auth, updateBusinessPassword);
router.delete("/:id", auth, deleteBusiness);

module.exports = router;
