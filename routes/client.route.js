const express = require("express");
const router = express.Router();
const {
  getClient,
  getOneClient,
  register,
  login,
  otpCheck,
  otpSend,
  changePassword,
  updateClient,
  updateClientPassword,
  deleteClient,
} = require("../controllers/client.controller");
const auth = require("../middlewares/auth");
const employeePic = require("../middlewares/employeePic");

router.get("/", auth, getClient);
router.get("/:id", auth, getOneClient);
router.post("/register", register);
router.post("/login", login);
router.post("/otp", otpSend);
router.post("/otp/check", otpCheck);
router.post("/reset/change", changePassword);
router.patch("/:id", auth, employeePic, updateClient);
router.patch("/password/:id", auth, updateClientPassword);
router.delete("/:id", auth, deleteClient);

module.exports = router;
