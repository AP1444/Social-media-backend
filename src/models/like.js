const { query } = require("../utils/database");

/**
 * Like model for managing post likes
 * TODO: Implement this model for the like functionality
 */

// TODO: Implement likePost function
// TODO: Implement unlikePost function
// TODO: Implement getPostLikes function
// TODO: Implement getUserLikes function
// TODO: Implement hasUserLikedPost function

const likePost = async (userId, postId) => {
  try {
    await query(
      `INSERT INTO likes (user_id, post_id, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, post_id) DO NOTHING`,
      [userId, postId]
    );
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Unlike a post
 * @param {number} userId - User ID
 * @param {number} postId - Post ID
 * @returns {Promise<boolean>} Success status
 */
const unlikePost = async (userId, postId) => {
  const result = await query(
    `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
  return result.rowCount > 0;
};

/**
 * Get all likes for a post
 * @param {number} postId - Post ID
 * @returns {Promise<Array>} Array of user IDs who liked the post
 */
const getPostLikes = async (postId) => {
  const result = await query(
    `SELECT user_id FROM likes WHERE post_id = $1`,
    [postId]
  );
  return result.rows.map(row => row.user_id);
};

/**
 * Get all posts liked by a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of post IDs liked by the user
 */
const getUserLikes = async (userId) => {
  const result = await query(
    `SELECT post_id FROM likes WHERE user_id = $1`,
    [userId]
  );
  return result.rows.map(row => row.post_id);
};

/**
 * Check if a user has liked a post
 * @param {number} userId - User ID
 * @param {number} postId - Post ID
 * @returns {Promise<boolean>} True if liked, false otherwise
 */
const hasUserLikedPost = async (userId, postId) => {
  const result = await query(
    `SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
  return result.rowCount > 0;
};

module.exports = {
	likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
  hasUserLikedPost,
};
