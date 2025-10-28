const express = require("express");
const router = express.Router();
const ChatController = require("../controller/chatController");

router.post("/ask", ChatController.handleChat);

module.exports = router;
