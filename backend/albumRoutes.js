const express = require("express");
const router = express.Router();
const albumController = require("../controllers/albumController");
const isAuth = require("../middleware/is-auth");

router.get("/user/:userId", isAuth, albumController.getAlbumsByUser);

module.exports = router;
