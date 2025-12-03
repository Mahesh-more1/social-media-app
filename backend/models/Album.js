const mongoose = require("mongoose");
const { Schema } = mongoose;

const albumSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Album name is required."],
      trim: true,
      maxlength: [100, "Album name cannot be more than 100 characters."],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters."],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
