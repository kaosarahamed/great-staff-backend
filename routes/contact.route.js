const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
  getSingleMessage,
  updateMessages,
  deleteMessages,
} = require("../controllers/contact.controller");
const auth = require("../middlewares/auth");

router.get("/", auth, getMessages);
router.get("/:id", auth, getSingleMessage);
router.post("/", createMessage);
router.patch("/:id", auth, updateMessages);
router.delete("/:id", auth, deleteMessages);

module.exports = router;
