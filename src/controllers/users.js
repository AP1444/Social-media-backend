// This controller should handle:
// - Following a user
// - Unfollowing a user
// - Getting users that the current user is following
// - Getting users that follow the current user
// - Getting follow counts for a user

const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowCounts,
} = require("../models/follow");
const { findUsersByName, getUserProfile } = require("../models/user");
const logger = require("../utils/logger");

/* 
Tasks did - Added follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getMyFollowStats,
  searchUsers,
  getProfileWithStats, functionality
*/

// This controller handles:
// - Following a user
// - Unfollowing a user
// - Getting users that the current user is following
// - Getting users that follow the current user
// - Getting follow counts for a user

/**
 * Follow a user
 */
const follow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { user_id: followingId } = req.body;

    if (followerId === parseInt(followingId)) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const success = await followUser(followerId, parseInt(followingId));
    if (!success) {
      return res.status(400).json({ error: "Unable to follow user" });
    }

    logger.verbose(`User ${followerId} followed user ${followingId}`);
    res.json({ message: "Followed user successfully" });
  } catch (error) {
    logger.critical("Follow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unfollow a user
 */
const unfollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { user_id: followingId } = req.body;

    if (followerId === parseInt(followingId)) {
      return res.status(400).json({ error: "You cannot unfollow yourself" });
    }

    const success = await unfollowUser(followerId, parseInt(followingId));
    if (!success) {
      return res.status(400).json({ error: "Unable to unfollow user" });
    }

    logger.verbose(`User ${followerId} unfollowed user ${followingId}`);
    res.json({ message: "Unfollowed user successfully" });
  } catch (error) {
    logger.critical("Unfollow error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get users that the current user is following
 */
const getMyFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const following = await getFollowing(userId);
    res.json({ following });
  } catch (error) {
    logger.critical("Get following error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get users that follow the current user
 */
const getMyFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await getFollowers(userId);
    res.json({ followers });
  } catch (error) {
    logger.critical("Get followers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get follow stats for the current user
 */
const getMyFollowStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const counts = await getFollowCounts(userId);
    res.json({ stats: counts });
  } catch (error) {
    logger.critical("Get follow stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Search users by name
 */
const searchUsers = async (req, res) => {
  try {
    const { name, limit = 10, offset = 0 } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required for search" });
    }
    const users = await findUsersByName(name, limit, offset);
    res.json({ users });
  } catch (error) {
    logger.critical("Search users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get user profile with follower/following counts
 */
const getProfileWithStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getUserProfile(userId);
    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ profile });
  } catch (error) {
    logger.critical("Get profile with stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getMyFollowStats,
  searchUsers,
  getProfileWithStats,
};
