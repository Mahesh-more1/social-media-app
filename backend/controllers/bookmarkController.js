const User = require("../models/User");
const Post = require("../models/Post");

exports.addBookmark = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token
    const postId = req.params.postId;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find user
    const user = await User.findById(userId);

    // Check if already bookmarked
    if (user.bookmarks.includes(postId)) {
      return res.status(400).json({ message: "Post already bookmarked" });
    }

    // Add bookmark
    user.bookmarks.push(postId);
    await user.save();

    res.json({
      message: "Bookmark added successfully",
      bookmarks: user.bookmarks.map(id => id.toString()),
    });
  } catch (error) {
    console.error("❌ Add bookmark error:", error);
    res.status(500).json({ message: "Failed to add bookmark" });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    console.log("🗑️ Removing bookmark:", { userId, postId });

    const user = await User.findById(userId);

    // Remove bookmark
    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== postId
    );
    await user.save();

  
    res.json({
      message: "Bookmark removed successfully",
      bookmarks: user.bookmarks.map(id => id.toString()),
    });
  } catch (error) {
    console.error("❌ Remove bookmark error:", error);
    res.status(500).json({ message: "Failed to remove bookmark" });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("bookmarks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.bookmarks); 
  } catch (error) {
    console.error("❌ Get bookmarks error:", error);
    res.status(500).json({ message: "Failed to get bookmarks" });
  }
};
