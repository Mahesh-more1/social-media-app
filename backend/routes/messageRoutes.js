const express = require("express");
const messageRoutes = express.Router();
const {
  sendMessage,
  getConversations,
  getMessages,
  deleteMessage,
} = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");

messageRoutes.post("/messages", authMiddleware, sendMessage);
messageRoutes.get("/conversations", authMiddleware, getConversations);
messageRoutes.get("/messages/:conversationId", authMiddleware, getMessages);
messageRoutes.delete("/messages/:messageId", authMiddleware, deleteMessage);

module.exports = messageRoutes;
