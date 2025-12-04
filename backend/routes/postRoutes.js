const express = require("express");
const {
  createPost,
  getPosts,
  editPost,
  deletePost,
  addLikePost,
  removeLikePost,
  addCommentToPost,
  deleteCommentFromPost,
  addLikeToComment,
  deleteLikeFromComment,
} = require("../controllers/postController");
const upload = require("../config/multerConfig");
const authMiddleware = require("../middlewares/authMiddleware");
const postRoutes = express.Router();

postRoutes.post(
  "/posts",
  authMiddleware,
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  createPost
);
postRoutes.patch("/posts/:postId", authMiddleware, editPost);
postRoutes.get("/posts", getPosts);
postRoutes.delete("/posts/:postId", authMiddleware, deletePost);
postRoutes.post("/posts/:postId/like", authMiddleware, addLikePost);
postRoutes.post("/posts/:postId/comments", authMiddleware, addCommentToPost);
postRoutes.delete("/posts/:postId/like", authMiddleware, removeLikePost);
postRoutes.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  deleteCommentFromPost
);
postRoutes.post(
  "/posts/:postId/comments/:commentId/like",
  authMiddleware,
  addLikeToComment
);
postRoutes.delete(
  "/posts/:postId/comments/:commentId/like",
  authMiddleware,
  deleteLikeFromComment
);

module.exports = postRoutes;
