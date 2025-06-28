const { query } = require("../utils/database");

/* 
Tasks did - Added followUser, unfollowUser, getFollowing, getFollowers, getFollowCounts fuuntionality
*/

/**
 * Follow model for managing user relationships
 */

/**
 * Follow a user
 * @param {number} followerId - The user who follows
 * @param {number} followingId - The user to be followed
 * @returns {Promise<boolean>} Success status
 */
const followUser = async (followerId, followingId) => {
  try {
    await query(
      `INSERT INTO follows (follower_id, following_id, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (follower_id, following_id) DO NOTHING`,
      [followerId, followingId]
    );
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Unfollow a user
 * @param {number} followerId - The user who unfollows
 * @param {number} followingId - The user to be unfollowed
 * @returns {Promise<boolean>} Success status
 */
const unfollowUser = async (followerId, followingId) => {
  const result = await query(
    `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
    [followerId, followingId]
  );
  return result.rowCount > 0;
};

/**
 * Get users that a user is following
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of user IDs being followed
 */
const getFollowing = async (userId) => {
  const result = await query(
    `SELECT following_id FROM follows WHERE follower_id = $1`,
    [userId]
  );
  return result.rows.map(row => row.following_id);
};

/**
 * Get followers of a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of follower user IDs
 */
const getFollowers = async (userId) => {
  const result = await query(
    `SELECT follower_id FROM follows WHERE following_id = $1`,
    [userId]
  );
  return result.rows.map(row => row.follower_id);
};

/**
 * Get follower and following counts for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} { followers: number, following: number }
 */
const getFollowCounts = async (userId) => {
  const result = await query(
    `SELECT
       (SELECT COUNT(*) FROM follows WHERE following_id = $1) AS followers,
       (SELECT COUNT(*) FROM follows WHERE follower_id = $1) AS following`,
    [userId]
  );
  return result.rows[0] || { followers: 0, following: 0 };
};

module.exports = {
	followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowCounts,
};
