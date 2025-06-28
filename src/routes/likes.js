const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  like,
  unlike,
  getLikesForPost,
  getLikesByUser,
} = require("../controllers/likes");

const router = express.Router();

/**
 * Likes routes
 * TODO: Implement like routes when like functionality is added
 */

// TODO: POST /api/likes - Like a post
router.post("/", authenticateToken, like);
// TODO: DELETE /api/likes/:post_id - Unlike a post
router.delete("/:post_id", authenticateToken, unlike); 
// TODO: GET /api/likes/post/:post_id - Get likes for a post
router.get("/post/:post_id", getLikesForPost);
// TODO: GET /api/likes/user/:user_id - Get posts liked by a user
router.get("/user/:user_id", getLikesByUser);

module.exports = router;
