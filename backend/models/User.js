const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, " Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, " Emaail is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, " Password is required"],
      minlength: 6,
      select: false,
    },
    handle: {
      type: String,
      unique: true,
      required: [true, "Handle is required"],
      validate: {
        validator: function (v) {
          return /^@[a-zA-Z0-9_]+$/.test(v);
        },
        message:
          "Handle must start with @ and contain only letters, numbers, and underscores",
      },
    },
    profilePicture: {
      type: String,
      default: "https://ui-avatars.com/api/?name=User&background=random",
    },
    coverPhoto: {
      type: String,
      default: "",
    },
    initials: {
      type: String,
      maxlength: 3,
      default: function () {
        return this.username.slice(0, 2).toUpperCase();
      },
    },
    bio: {
      type: String,
      maxlength: 400,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    profession: {
      type: String,
      default: "",
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
