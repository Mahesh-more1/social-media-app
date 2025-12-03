const Album = require("../models/Album");
const Post = require("../models/Post");
const User = require("../models/User");

// @desc    Create a new album
// @route   POST /api/albums
// @access  Private
exports.createAlbum = async (req, res) => {
  try {
    const { name, description } = req.body;
    const creator = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Album name is required." });
    }

    const album = await Album.create({
      name,
      description,
      creator,
    });

    res.status(201).json(album);
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all albums for a user
// @route   GET /api/albums/user/:userId
// @access  Public
exports.getUserAlbums = async (req, res) => {
  try {
    const { userId } = req.params;
    const albums = await Album.find({ creator: userId }).populate("posts");
    res.status(200).json(albums);
  } catch (error) {
    console.error("Error fetching user albums:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single album by ID
// @route   GET /api/albums/:albumId
// @access  Public
exports.getAlbumById = async (req, res) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId).populate({
      path: "posts",
      populate: {
        path: "authorId",
        select: "username profilePicture",
      },
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json(album);
  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a post to an album
// @route   PUT /api/albums/:albumId/add-post
// @access  Private
exports.addPostToAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { postId } = req.body;
    const userId = req.user.id;

    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    if (album.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to modify this album" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (album.posts.includes(postId)) {
      return res
        .status(400)
        .json({ message: "Post already in this album" });
    }

    album.posts.push(postId);
    await album.save();

    res.status(200).json(album);
  } catch (error) {
    console.error("Error adding post to album:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Remove a post from an album
// @route   PUT /api/albums/:albumId/remove-post
// @access  Private
exports.removePostFromAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { postId } = req.body;
    const userId = req.user.id;

    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    if (album.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to modify this album" });
    }

    album.posts = album.posts.filter((p) => p.toString() !== postId);
    await album.save();

    res.status(200).json(album);
  } catch (error) {
    console.error("Error removing post from album:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete an album
// @route   DELETE /api/albums/:albumId
// @access  Private
exports.deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const userId = req.user.id;

    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    if (album.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this album" });
    }

    await album.deleteOne();

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).json({ message: "Server error" });
  }
};
