const express = require("express");
const router = express.Router();
const {
  getAllJob,
  getOneJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/job.controller");
const auth = require("../middlewares/auth");

router.get("/", auth, getAllJob);
router.get("/:id", auth, getOneJob);
router.post("/", auth, createJob);
router.patch("/:id", auth, updateJob);
router.delete("/:id", auth, deleteJob);

module.exports = router;
