const path = require("path");
const fs = require("fs");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, tags, privacy } = req.body;
    const userId = req.user.id;
    let postImages = [];
    if (req.files && req.files.length > 0) {
      postImages = req.files.map((file) => `/uploads/${file.filename}`);
    }
    let parsedTags = [];
    if (tags && typeof tags === "string") {
      parsedTags = tags
        .split(/[\s,]+/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    } else {
      console.log("❌ NOT entering split! tags is:", tags);
    }

    const user = await User.findById(userId);

    const newPost = new Post({
      title,
      content,
      tags: parsedTags,
      author: user.username,
      authorId: userId,
      privacy,
      postImages,
    });
    await newPost.save();
    res.json(newPost);
  } catch (e) {
    console.error("❌ Error creating post:", e);
    res.status(500).json({
      message: "Failed to create post",
      error: e.message,
    });
  }
};
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    const shuffledPosts = shuffleArray(posts);
    res.json(shuffledPosts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};
exports.editPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const { title, content, tags, privacy } = req.body;

    console.log("📝 Edit request:", {
      postId,
      userId,
      body: req.body,
    });

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    if (post.authorId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only edit your own posts",
      });
    }

    let parsedTags = tags;
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(/[\s,]+/).filter((tag) => tag.trim());
      }
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        content,
        tags: parsedTags,
        privacy,
      },
      { new: true, runValidators: true }
    );

    console.log("✅ Post updated:", updatedPost._id);

    res.json(updatedPost);
  } catch (error) {
    console.error("❌ Error editing post:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      message: "Failed to edit post",
      error: error.message,
    });
  }
};
exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (post.authorId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only delete your own posts",
      });
    }
    const isPostExit = await Post.findById(postId);
    if (!isPostExit) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    if (isPostExit.postImages) {
      isPostExit.postImages.map((postImg) => {
        const oldFilePath = path.join(__dirname, "..", postImg);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log("✅ Image deleted");
        }
      });
    }
    await Post.findByIdAndDelete(postId);
    res.json(postId);
  } catch (error) {
    console.error("❌ Error editing post:", error);

    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
};
exports.addLikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    console.log("👤 User liking:", userId);
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Already liked this post" });
    }
    post.likedBy.unshift(userId);
    post.likes = post.likedBy.length;
    await post.save();

    if (post.authorId.toString() !== userId.toString()) {
      const user = await User.findById(userId);
      await Notification.create({
        userId: post.authorId,
        senderId: userId,
        senderName: user.username,
        type: "like",
        action: "liked your post",
        postId: post._id,
      });
    }

    res.json({
      message: "Post liked successfully",
      post: {
        id: post._id,
        likes: post.likes,
        likedBy: post.likedBy,
      },
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Failed to like post" });
  }
};
exports.removeLikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.likedBy = post.likedBy.filter((id) => id.toString() !== userId);
    post.likes = post.likedBy.length;
    await post.save();
    res.json({
      message: "Like removed successfully",
      post: {
        id: post._id,
        likes: post.likes,
        likedBy: post.likedBy,
      },
    });
  } catch (error) {
    console.error("Unlike error:", error);
    res.status(500).json({ message: "Failed to unlike post" });
  }
};
exports.addCommentToPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const text = req.body.text;
    const user = await User.findById(userId).select("username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const newComment = {
      text,
      author: user.username,
      authorId: userId,
    };
    post.comments.push(newComment);
    post.commentsCount = post.comments.length;
    await post.save();
    const addedComment = post.comments[post.comments.length - 1];

    // Create notification if user is not commenting on their own post
    if (post.authorId.toString() !== userId.toString()) {
      await Notification.create({
        userId: post.authorId,
        senderId: userId,
        senderName: user.username,
        type: "comment",
        action: "commented on your post",
        postId: post._id,
        commentId: addedComment._id.toString(),
      });
    }

    res.status(201).json({
      message: "Comment added successfully",
      comment: addedComment,
      post: {
        id: post._id,
        commentsCount: post.commentsCount,
      },
    });
  } catch (error) {
    console.error(" Add comment error:", error);
    res.status(500).json({ message: "Failed to Add a comment" });
  }
};
exports.deleteCommentFromPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const commentIndex = post.comments.findIndex(
      (c) => c._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const comment = post.comments[commentIndex];
    if (comment.authorId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only delete your own comments",
      });
    }
    post.comments.pull(commentId);
    post.commentsCount = post.comments.length;

    await post.save();

    console.log("✅ COMMENT DELETED:", commentId);

    res.json({
      message: "Comment deleted successfully",
      post: {
        id: post._id.toString(),
        commentsCount: post.commentsCount,
      },
    });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};
exports.addLikeToComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id.toString();

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const alreadyLiked = comment.likedBy.some((id) => id.toString() === userId);
    if (alreadyLiked) {
      return res.status(400).json({ message: "Already liked this comment" });
    }

    comment.likedBy.push(userId);
    comment.likes = comment.likedBy.length;

    await post.save();

    return res.json({
      message: "Comment liked successfully",
      comment: {
        id: comment._id,
        likes: comment.likes,
        likedBy: comment.likedBy,
      },
    });
  } catch (error) {
    console.error("Like on Comment error:", error);
    res.status(500).json({ message: "Failed to like comment" });
  }
};
exports.deleteLikeFromComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.likedBy = comment.likedBy.filter((id) => id.toString() !== userId);
    comment.likes = comment.likedBy.length;
    await post.save();
    res.json({
      message: "Like on comment removed successfully",
      post: {
        id: post._id,
        likes: post.likes,
        likedBy: post.likedBy,
      },
    });
  } catch (error) {
    console.error("Unlike error:", error);
    res.status(500).json({ message: "Failed to unlike post" });
  }
};
