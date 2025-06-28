// This controller should handle:
// - Creating comments on posts
// - Editing user's own comments
// - Deleting user's own comments
// - Getting comments for a post
// - Pagination for comments

const {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
	getCommentById
} = require("../models/comment");
const logger = require("../utils/logger");

/* 
Tasks did - Added
  createComment,
  updateComment
  deleteComment,
  getPostComments functionality
*/


/**
 * Create a comment on a post
 */
const create = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id, content } = req.body;
    if (!post_id || !content) {
      return res.status(400).json({ error: "post_id and content are required" });
    }
    const comment = await createComment({ user_id: userId, post_id, content });
    logger.verbose(`User ${userId} commented on post ${post_id}`);
    res.status(201).json({ message: "Comment created", comment });
  } catch (error) {
    logger.critical("Create comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a user's own comment
 */
const update = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comment_id } = req.params;

    // Fetch the comment to get its content
    const comment = await getCommentById(parseInt(comment_id));
    if (!comment || comment.user_id !== userId) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }

    const content = req.body.content;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const updated = await updateComment(parseInt(comment_id), userId, content);
    if (!updated) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }
    logger.verbose(`User ${userId} updated comment ${comment_id}`);
    res.json({ message: "Comment updated", comment: updated });
  } catch (error) {
    logger.critical("Update comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a user's own comment (soft delete)
 */
const remove = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comment_id } = req.params;
    const success = await deleteComment(parseInt(comment_id), userId);
    if (!success) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }
    logger.verbose(`User ${userId} deleted comment ${comment_id}`);
    res.json({ message: "Comment deleted" });
  } catch (error) {
    logger.critical("Delete comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get comments for a post (paginated)
 */
const getForPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const allComments = await getPostComments(parseInt(post_id));
    const comments = allComments.slice(offset, offset + limit);
    res.json({
      comments,
      pagination: {
        page,
        limit,
        hasMore: comments.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get post comments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  update,
  remove,
  getForPost,
};
