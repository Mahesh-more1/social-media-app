const Notification = require("../models/Notification");
const mongoose = require("mongoose");

const formatNotificationResponse = (notification) => {
  return {
    id: notification._id.toString(),
    userId: notification.userId.toString(),
    senderId: notification.senderId.toString(),
    senderName: notification.senderName,
    type: notification.type,
    action: notification.action,
    postId: notification.postId ? notification.postId.toString() : null,
    commentId: notification.commentId,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  };
};

exports.createNotification = async (req, res, next) => {
  try {
    const { userId, senderId, senderName, type, action, postId, commentId } =
      req.body;

    if (!userId || !senderId || !type || !action) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const newNotification = await Notification.create({
      userId,
      senderId,
      senderName,
      type,
      action,
      postId: postId || null,
      commentId: commentId || null,
    });

    res.status(201).json({
      message: "Notification created successfully",
      data: formatNotificationResponse(newNotification),
    });
  } catch (error) {
    console.error("❌ Create notification error:", error);
    res.status(500).json({
      message: "Failed to create notification",
      error: error.message,
    });
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const notifications = await Notification.find({ userId })
      .sort({
        createdAt: -1,
      })
      .lean();

    res.status(200).json({
      message: "Notifications fetched successfully",
      data: notifications.map(formatNotificationResponse),
    });
  } catch (error) {
    console.error("❌ Get notifications error:", error);
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification marked as read",
      data: formatNotificationResponse(notification),
    });
  } catch (error) {
    console.error("❌ Mark as read error:", error);
    res.status(500).json({
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    await Notification.updateMany({ userId }, { isRead: true });

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("❌ Mark all as read error:", error);
    res.status(500).json({
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete notification error:", error);
    res.status(500).json({
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};
