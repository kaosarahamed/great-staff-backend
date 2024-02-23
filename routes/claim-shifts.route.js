const express = require("express");
const router = express.Router();
const {
  getAllClaimShifts,
  getOneClaimShifts,
  createClaimShifts,
  updateClaimShifts,
  deleteClaimShifts,
  updateComplete,
  updateProgress,
  getActiveOneClaimShifts,
} = require("../controllers/claim-shifts.controller");
const auth = require("../middlewares/auth");

router.get("/", auth, getAllClaimShifts);
router.get("/:id", auth, getOneClaimShifts);
router.get("/claimed/:id", auth, getActiveOneClaimShifts);
router.post("/", auth, createClaimShifts);
router.patch("/:id", auth, updateClaimShifts);
router.patch("/status/progress/:id", auth, updateProgress);
router.patch("/status/complete/:id", auth, updateComplete);
router.delete("/:id", auth, deleteClaimShifts);

module.exports = router;
