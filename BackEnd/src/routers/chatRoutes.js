const express = require("express");
const router = express.Router();
const ChatController = require("../controller/chatController");

const validateChatRequest = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: "Bạn phải gửi kèm 'message' dạng text.",
    });
  }

  if (message.length > 500) {
    return res.status(400).json({
      error: "Tin nhắn quá dài, vui lòng rút gọn.",
    });
  }

  next();
};

router.post("/ask", validateChatRequest, ChatController.handleChat);

module.exports = router;
