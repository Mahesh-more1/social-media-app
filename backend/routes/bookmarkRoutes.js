const express = require("express");
const bookmarkRoutes = express.Router();
const {
  addBookmark,
  removeBookmark,
  getBookmarks,
} = require("../controllers/bookmarkController");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ All routes require authentication
bookmarkRoutes.post("/bookmarks/:postId", authMiddleware, addBookmark);
bookmarkRoutes.delete("/bookmarks/:postId", authMiddleware, removeBookmark);
bookmarkRoutes.get("/bookmarks", authMiddleware, getBookmarks);

module.exports = bookmarkRoutes;
