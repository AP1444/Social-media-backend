const { query } = require("../utils/database");

/* 
Tasks did - Added getFeedPosts, updatePost, searchPosts fuuntionality
- filter out deleted posts
-is_deleted shold be marked as true while deleting post
*/

/**
 * Post model for database operations
 */

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @returns {Promise<Object>} Created post
 */
const createPost = async ({
  user_id,
  content,
  media_url,
  comments_enabled = true,
  scheduled_at = null,
}) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled, created_at, is_deleted, scheduled_at)
     VALUES ($1, $2, $3, $4, NOW(), false, $5)
     RETURNING id, user_id, content, media_url, comments_enabled, created_at, scheduled_at`,
    [user_id, content, media_url, comments_enabled, scheduled_at],
  );
  return result.rows[0];
};

/**
 * Get post by ID
 * @param {number} postId - Post ID
 * @returns {Promise<Object|null>} Post object or null
 */
const getPostById = async (postId) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1 AND p.is_deleted = false`,
    [postId],
  );
  //filter out deleted posts

  return result.rows[0] || null;
};

/**
 * Get posts by user ID
 * @param {number} userId - User ID
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of posts
 */
const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1 AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );
  //filter out deleted posts

  return result.rows;
};

/**
 * Delete a post
 * @param {number} postId - Post ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<boolean>} Success status
 */
const deletePost = async (postId, userId) => {
  const result = await query(
    "UPDATE posts SET is_deleted = true WHERE id = $1 AND user_id = $2",
    [postId, userId],
  );
  //is_deleted shold be marked as true while deleting post

  return result.rowCount > 0;
};

/**
 * Get feed posts from followed users (with pagination)
 * @param {number} userId - User ID
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of posts
 */
const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id IN (
       SELECT following_id FROM follows WHERE follower_id = $1
     ) AND p.is_deleted = false AND p.scheduled_at IS NULL
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};

/**
 * Update a post's content or media_url
 * @param {number} postId - Post ID
 * @param {number} userId - User ID (for ownership verification)
 * @param {Object} updates - Fields to update (content, media_url, comments_enabled)
 * @returns {Promise<Object|null>} Updated post object
 */
const updatePost = async (postId, userId, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.content) {
    fields.push(`content = $${idx++}`);
    values.push(updates.content);
  }
  if (updates.media_url) {
    fields.push(`media_url = $${idx++}`);
    values.push(updates.media_url);
  }
  if (typeof updates.comments_enabled === "boolean") {
    fields.push(`comments_enabled = $${idx++}`);
    values.push(updates.comments_enabled);
  }

  if (fields.length === 0) return null;

  values.push(postId, userId);

  const result = await query(
    `UPDATE posts SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${idx++} AND user_id = $${idx} AND is_deleted = false
     RETURNING id, user_id, content, media_url, comments_enabled, created_at, updated_at`,
    values
  );
  return result.rows[0] || null;
};

/**
 * Search posts by content (case-insensitive, paginated)
 * @param {string} searchTerm - Search term
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of posts
 */
const searchPosts = async (searchTerm, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.content ILIKE $1 AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, limit, offset]
  );
  return result.rows;
};

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePost,
  searchPosts,
};
