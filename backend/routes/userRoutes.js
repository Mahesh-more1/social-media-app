const express = require("express");
const userRoutes = express.Router();
const {
  addUser,
  loginUser,
  editUserProfile,
  getAllUsers,
  followToggle,
} = require("../controllers/userController");
const upload = require("../config/multerConfig");
const authMiddleware = require("../middlewares/authMiddleware");

userRoutes.post("/user/signup", addUser);
userRoutes.post("/user/login", loginUser);
userRoutes.get("/users", getAllUsers);
userRoutes.patch(
  "/user/profile",
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  editUserProfile
);
userRoutes.post("/user/:userId/follow", authMiddleware, followToggle);

module.exports = userRoutes;
