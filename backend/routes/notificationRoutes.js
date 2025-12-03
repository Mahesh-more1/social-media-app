const express = require("express");
const notificationRoutes = express.Router();
const {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

notificationRoutes.post("/notifications", createNotification);
notificationRoutes.get("/notifications", authMiddleware, getNotifications);
notificationRoutes.patch(
  "/notifications/:notificationId/read",
  authMiddleware,
  markAsRead
);
notificationRoutes.patch(
  "/notifications/read-all",
  authMiddleware,
  markAllAsRead
);
notificationRoutes.delete(
  "/notifications/:notificationId",
  authMiddleware,
  deleteNotification
);

module.exports = notificationRoutes;
