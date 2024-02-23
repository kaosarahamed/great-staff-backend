const express = require("express");
const router = express.Router();
const {
  getAllShifts,
  getOneShift,
  createShifts,
  updateShifts,
  deleteShifts,
  updateShiftStatus,
} = require("../controllers/shifts.controller");

const auth = require("../middlewares/auth");

router.get("/", auth, getAllShifts);
router.get("/:id", auth, getOneShift);
router.post("/", auth, createShifts);
router.patch("/:id", auth, updateShifts);
router.patch("/status/:id", auth, updateShiftStatus);
router.delete("/:id", auth, deleteShifts);

module.exports = router;
