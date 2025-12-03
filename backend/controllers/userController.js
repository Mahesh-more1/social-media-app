const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { generateToken } = require("../utils/jwtUtils");

const formatUserResponse = (user) => {
  return {
    id: user._id.toString(),
    userName: user.username,
    email: user.email,
    handle: user.handle,
    bio: user.bio || "",
    profilePicture: user.profilePicture || "",
    coverPhoto: user.coverPhoto || "",
    location: user.location || "",
    profession: user.profession || "",
    website: user.website || "",
    followers: (user.followers || []).map((id) => id.toString()),
    followersCount: user.followersCount || 0,
    following: (user.following || []).map((id) => id.toString()),
    followingCount: user.followingCount || 0,
    postsCount: user.postsCount || 0,
    bookmarks: (user.bookmarks || []).map((id) => id.toString()),
    createdAt: user.createdAt,
  };
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    const formattedUsers = users.map((user) => formatUserResponse(user));

    res.status(200).json({
      message: "Users fetched successfully",
      users: formattedUsers,
    });
  } catch (error) {
    console.error("❌ Get users error:", error);
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const {
      username,
      email,
      handle,
      location,
      profession,
      password,
      confirmPassword,
    } = req.body;

    if (!username || !email || !handle || !password) {
      return res.status(400).json({
        message: "Required fields missing",
        required: ["username", "email", "handle", "password"],
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { handle }],
    });

    if (existingUser) {
      let field = "";
      if (existingUser.email === email) field = "Email";
      else if (existingUser.username === username) field = "Username";
      else if (existingUser.handle === handle) field = "Handle";

      return res.status(400).json({
        message: `${field} already exists. Please use a different one.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      handle,
      location: location || "",
      profession: profession || "",
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User created successfully",
      token: token,
      user: formatUserResponse(newUser),
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Server error during signup",
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);
    const formattedUser = formatUserResponse(user);

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: formattedUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};

exports.editUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { handle, bio, location, profession, website } = req.body;

    console.log("📝 req.body:", req.body);
    console.log("📸 req.files:", req.files);
    console.log("👤 User ID from token:", userId);

    if (!handle) {
      return res.status(400).json({
        message: "Handle is required",
      });
    }

    const updateData = {
      handle,
      bio: bio || "",
      location: location || "",
      profession: profession || "",
      website: website || "",
    };

    if (req.files && req.files.profilePicture) {
      const profilePicFile = req.files.profilePicture[0];
      updateData.profilePicture = `http://localhost:3000/${profilePicFile.path.replace(
        /\\/g,
        "/"
      )}`;
      console.log("📷 Profile picture:", updateData.profilePicture);
    }

    if (req.files && req.files.coverPhoto) {
      const coverPhotoFile = req.files.coverPhoto[0];
      updateData.coverPhoto = `http://localhost:3000/${coverPhotoFile.path.replace(
        /\\/g,
        "/"
      )}`;
      console.log("🖼️ Cover photo:", updateData.coverPhoto);
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User updated successfully");

    res.status(200).json({
      message: "Profile updated successfully",
      user: formatUserResponse(user), // ✅ Consistent!
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({
      message: "Server error during profile update",
      error: error.message,
    });
  }
};

exports.followToggle = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const targetUserId = req.params.userId;

    if (userId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = user.following.includes(targetUserId);

    if (isFollowing) {
      user.following = user.following.filter(
        (id) => id.toString() !== targetUserId
      );
      user.followingCount -= 1;
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== userId
      );
      targetUser.followersCount -= 1;
    } else {
      // Follow
      user.following.push(targetUserId);
      user.followingCount += 1;
      targetUser.followers.push(userId);
      targetUser.followersCount += 1;

      // Create notification for follow
      await Notification.create({
        userId: targetUserId,
        senderId: userId,
        senderName: user.username,
        type: "follow",
        action: "started following you",
      });
    }

    await user.save();
    await targetUser.save();

    res.json({
      message: `Successfully ${isFollowing ? "unfollowed" : "followed"} user.`,
      user: formatUserResponse(user),
      targetUser: formatUserResponse(targetUser),
    });
  } catch (error) {
    console.error("Follow toggle error:", error);
    res.status(500).json({ message: "Failed to toggle follow" });
  }
};
