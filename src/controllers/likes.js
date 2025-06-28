// This controller should handle:
// - Liking posts
// - Unliking posts
// - Getting likes for a post
// - Getting posts liked by a user

const {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
} = require("../models/like");
const logger = require("../utils/logger");

/* 
Tasks did - Added
  likePost,
  unlikePost
  getPostLikes,
  getUserLikes functionality
*/

/**
 * Like a post
 */
const like = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.body;
    if (!post_id) {
      return res.status(400).json({ error: "post_id is required" });
    }
    const success = await likePost(userId, parseInt(post_id));
    if (!success) {
      return res.status(400).json({ error: "Unable to like post" });
    }
    logger.verbose(`User ${userId} liked post ${post_id}`);
    res.json({ message: "Post liked successfully" });
  } catch (error) {
    logger.critical("Like post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unlike a post
 */
const unlike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.params;
    if (!post_id) {
      return res.status(400).json({ error: "post_id is required" });
    }
    const success = await unlikePost(userId, parseInt(post_id));
    if (!success) {
      return res.status(400).json({ error: "Unable to unlike post" });
    }
    logger.verbose(`User ${userId} unliked post ${post_id}`);
    res.json({ message: "Post unliked successfully" });
  } catch (error) {
    logger.critical("Unlike post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get likes for a post
 */
const getLikesForPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    if (!post_id) {
      return res.status(400).json({ error: "post_id is required" });
    }
    const userIds = await getPostLikes(parseInt(post_id));
    res.json({ likes: userIds });
  } catch (error) {
    logger.critical("Get post likes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get posts liked by a user
 */
const getLikesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }
    const postIds = await getUserLikes(parseInt(user_id));
    res.json({ liked_posts: postIds });
  } catch (error) {
    logger.critical("Get user likes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  like,
  unlike,
  getLikesForPost,
  getLikesByUser,
};
