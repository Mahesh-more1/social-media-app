const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createAlbum,
  getUserAlbums,
  getAlbumById,
  addPostToAlbum,
  removePostFromAlbum,
  deleteAlbum,
} = require("../controllers/albumController");

// Create a new album
router.post("/", authMiddleware, createAlbum);

// Get all albums for a specific user
router.get("/user/:userId", getUserAlbums);

// Get a single album by its ID
router.get("/:albumId", getAlbumById);

// Add a post to a specific album
router.put("/:albumId/add-post", authMiddleware, addPostToAlbum);

// Remove a post from a specific album
router.put("/:albumId/remove-post", authMiddleware, removePostFromAlbum);

// Delete an album
router.delete("/:albumId", authMiddleware, deleteAlbum);

module.exports = router;
