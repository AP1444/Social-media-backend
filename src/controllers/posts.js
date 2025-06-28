const {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePost,
  searchPosts
} = require("../models/post.js");
const logger = require("../utils/logger");

/**
 * Create a new post
 */
const create = async (req, res) => {
  try {
    const { content, media_url, comments_enabled } = req.validatedData;
    const userId = req.user.id;

    const post = await createPost({
      user_id: userId,
      content,
      media_url,
      comments_enabled,
    });

    logger.verbose(`User ${userId} created post ${post.id}`);

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    logger.critical("Create post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
/**
 * Create a scheduled post
 */
const schedule = async (req, res) => {
  try {
    const { content, media_url, comments_enabled, scheduled_at } = req.body;
    const userId = req.user.id;

    if (!scheduled_at || isNaN(Date.parse(scheduled_at))) {
      return res.status(400).json({ error: "Valid scheduled_at timestamp required" });
    }
    if (new Date(scheduled_at) <= new Date()) {
      return res.status(400).json({ error: "scheduled_at must be in the future" });
    }

    const post = await createPost({
      user_id: userId,
      content,
      media_url,
      comments_enabled,
      scheduled_at,
    });

    logger.verbose(`User ${userId} scheduled post ${post.id} for ${scheduled_at}`);

    res.status(201).json({
      message: "Post scheduled successfully",
      post,
    });
  } catch (error) {
    logger.critical("Schedule post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a single post by ID
 */
const getById = async (req, res) => {
  try {
    const { post_id } = req.params;
    const postIdInt = parseInt(post_id, 10);
    console.log(`post_id == ${post_id}`);

    if (isNaN(postIdInt)) {
      return res.status(400).json({ error: "Invalid post_id" });
    }

    const post = await getPostById(postIdInt);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ post });
  } catch (error) {
    logger.critical("Get post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get posts by a specific user
 */
const getUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(parseInt(user_id), limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get user posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get current user's posts
 */
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;  //no param is passed, so we use req.user.id
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(userId, limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Get my posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a post
 */
const remove = async (req, res) => {
  try {
    const { post_id } = req.params;
    const userId = req.user.id;

    const success = await deletePost(parseInt(post_id), userId);

    if (!success) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    logger.verbose(`User ${userId} deleted post ${post_id}`);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    logger.critical("Delete post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// TODO: Implement getFeed controller for content feed functionality
// This should return posts from users that the current user follows

// TODO: Implement updatePost controller for editing posts

// TODO: Implement searchPosts controller for searching posts by content

/**
 * Get feed posts from followed users
 * This should return posts from users that the current user follows
 */
const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`userId == ${userId}`);

    const posts = await getFeedPosts(parseInt(userId));

    res.json({
      posts,
      pagination: null,
    });
  } catch (error) {
    logger.critical("Get feed error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a post (edit content, media_url, or comments_enabled)
 */
const update = async (req, res) => {
  try {
    const { post_id } = req.params;
    const userId = req.user.id;
    const { content, media_url, comments_enabled } = req.body;

    const updates = {};
    if (content !== undefined) updates.content = content;
    if (media_url !== undefined) updates.media_url = media_url;
    if (comments_enabled !== undefined) updates.comments_enabled = comments_enabled;

    const updatedPost = await updatePost(parseInt(post_id), userId, updates);

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    logger.verbose(`User ${userId} updated post ${post_id}`);

    res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    logger.critical("Update post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Search posts by content
 */
const search = async (req, res) => {
  try {
    const { q, limit = 20, offset = 0 } = req.body;
    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const posts = await searchPosts(q, parseInt(limit), parseInt(offset));
    res.json({ posts });
  } catch (error) {
    logger.critical("Search posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  schedule,
  getById,
  getUserPosts,
  getMyPosts,
  remove,
  getFeed,
  update,
  search,
};