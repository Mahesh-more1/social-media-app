const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const errorController = require("./controllers/errorController");
const User = require("./models/User");
const Post = require("./models/Post");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const albumRoutes = require("./routes/albumRoutes");

const app = express();

app.get("/", (req, res) => res.send("Hello from the Pulse backend!"));

// Define the time in milliseconds (30 days)
// 1000ms * 60s * 60m * 24h * 30d
const thirtyDaysInMs = 1000 * 60 * 60 * 24 * 30;

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: thirtyDaysInMs,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use("/api/albums", albumRoutes);

app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", bookmarkRoutes);
app.use("/api", messageRoutes);
app.use("/api", notificationRoutes);

app.use(errorController.pageNotFound);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_PATH)
  .then(() => {
    console.log("✅ Connected to mongo DB via MONGOOSE");
    app.listen(PORT, () => {
      console.log(`Server Has Been Started Listening On Port: ${PORT}`);
      console.log(`Click here to Check http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error while connecting to Mongo DB ", error);
  });
