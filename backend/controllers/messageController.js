const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

const formatMessageResponse = (message) => {
  return {
    id: message._id.toString(),
    senderId: message.senderId.toString(),
    senderName: message.senderName,
    recipientId: message.recipientId.toString(),
    recipientName: message.recipientName,
    text: message.text,
    image: message.image,
    isRead: message.isRead,
    conversationId: message.conversationId,
    createdAt: message.createdAt,
  };
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientId, recipientName, text, image } = req.body;
    const senderId = req.user.id;

    // Get sender info from database
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const senderName = sender.username;

    if (!recipientId || !text) {
      return res.status(400).json({
        message: "Recipient and text are required",
      });
    }

    const conversationId = [senderId, recipientId].sort().join("-");

    const newMessage = await Message.create({
      senderId: new mongoose.Types.ObjectId(senderId),
      senderName,
      recipientId: new mongoose.Types.ObjectId(recipientId),
      recipientName,
      text,
      image: image || null,
      conversationId,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: formatMessageResponse(newMessage),
    });
  } catch (error) {
    console.error("❌ Send message error:", error);
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { recipientId: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$recipientId", userId] },
                    { $eq: ["$isRead", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);

    console.log("User ID:", userId);
    console.log("Raw conversations from DB:", conversations.length);

    const formattedConversations = conversations.map((conv) => {
      const lastMsg = conv.lastMessage;

      // Determine the other user based on who sent the last message
      let otherUser;
      if (
        lastMsg.senderId === userId ||
        lastMsg.senderId.toString() === userId.toString()
      ) {
        // Current user sent last message, so other user is recipient
        otherUser = {
          id: lastMsg.recipientId.toString(),
          name: lastMsg.recipientName,
        };
      } else {
        // Other user sent last message
        otherUser = {
          id: lastMsg.senderId.toString(),
          name: lastMsg.senderName,
        };
      }

      return {
        conversationId: conv._id,
        otherUser,
        lastMessage: lastMsg.text,
        lastMessageTime: lastMsg.createdAt,
        unreadCount: conv.unreadCount,
      };
    });

    console.log("Formatted conversations:", formattedConversations);
    res.status(200).json({
      message: "Conversations fetched successfully",
      data: formattedConversations,
    });
  } catch (error) {
    console.error("❌ Get conversations error:", error);
    res.status(500).json({
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        recipientId: userId,
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({
      message: "Messages fetched successfully",
      data: messages.map(formatMessageResponse),
    });
  } catch (error) {
    console.error("❌ Get messages error:", error);
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete message error:", error);
    res.status(500).json({
      message: "Failed to delete message",
      error: error.message,
    });
  }
};
