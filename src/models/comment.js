const { query } = require("../utils/database");

/* 
Tasks did - Added createComment, updateComment, deleteComment, getPostComments, getCommentById fuuntionality
*/

/**
 * Comment model for managing post comments
 */


/**
 * Create a new comment
 * @param {Object} commentData - { user_id, post_id, content }
 * @returns {Promise<Object>} Created comment
 */
const createComment = async ({ user_id, post_id, content }) => {
  const result = await query(
    `INSERT INTO comments (user_id, post_id, content, created_at, updated_at, is_deleted)
     VALUES ($1, $2, $3, NOW(), NOW(), FALSE)
     RETURNING id, user_id, post_id, content, created_at, updated_at`,
    [user_id, post_id, content]
  );
  return result.rows[0];
};

/**
 * Update a comment's content
 * @param {number} commentId - Comment ID
 * @param {number} userId - User ID (for ownership verification)
 * @param {string} content - New content
 * @returns {Promise<Object|null>} Updated comment or null
 */
const updateComment = async (commentId, userId, content) => {
  const result = await query(
    `UPDATE comments SET content = $1, updated_at = NOW()
     WHERE id = $2 AND user_id = $3 AND is_deleted = FALSE
     RETURNING id, user_id, post_id, content, created_at, updated_at`,
    [content, commentId, userId]
  );
  return result.rows[0] || null;
};

/**
 * Soft delete a comment
 * @param {number} commentId - Comment ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<boolean>} Success status
 */
const deleteComment = async (commentId, userId) => {
  const result = await query(
    `UPDATE comments SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE`,
    [commentId, userId]
  );
  return result.rowCount > 0;
};

/**
 * Get all comments for a post (not deleted, newest first)
 * @param {number} postId - Post ID
 * @returns {Promise<Array>} Array of comments
 */
const getPostComments = async (postId) => {
  const result = await query(
    `SELECT c.*, u.username, u.full_name
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1 AND c.is_deleted = FALSE
     ORDER BY c.created_at DESC`,
    [postId]
  );
  return result.rows;
};

/**
 * Get a comment by ID
 * @param {number} commentId - Comment ID
 * @returns {Promise<Object|null>} Comment object or null
 */
const getCommentById = async (commentId) => {
  const result = await query(
    `SELECT c.*, u.username, u.full_name
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.id = $1 AND c.is_deleted = FALSE`,
    [commentId]
  );
  return result.rows[0] || null;
};

module.exports = {
	createComment,
  updateComment,
  deleteComment,
  getPostComments,
  getCommentById,
};
