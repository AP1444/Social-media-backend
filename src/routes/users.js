const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getMyFollowStats,
  searchUsers,
  getProfileWithStats,
} = require("../controllers/users");

const router = express.Router();

/* 
Tasks did - Added required routes
*/

/**
 * User-related routes
 */

// POST /api/users/follow - Follow a user
router.post("/follow", authenticateToken, follow);
// DELETE /api/users/unfollow - Unfollow a user
router.delete("/unfollow", authenticateToken, unfollow);
// GET /api/users/following - Get users that current user follows
router.get("/following", authenticateToken, getMyFollowing);
// GET /api/users/followers - Get users that follow current user
router.get("/followers", authenticateToken, getMyFollowers);
// GET /api/users/stats - Get follow stats for current user
router.get("/stats", authenticateToken, getMyFollowStats);
// POST /api/users/search - Find users by name
router.post("/search", searchUsers);
// GET /api/users/profile - Get user profile with follower/following counts
router.get("/profile", authenticateToken, getProfileWithStats);

module.exports = router;
