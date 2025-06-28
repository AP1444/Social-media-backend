const express = require("express");
const { validateRequest, createPostSchema } = require("../utils/validation");
const {
	create,
	schedule,
	getById,
	getUserPosts,
	getMyPosts,
	remove,
	getFeed,
	update,
	search
} = require("../controllers/posts");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();

/* 
Tasks did - Added required routes
*/

/**
 * Posts routes
 */

// POST /api/posts - Create a new post
router.post("/", authenticateToken, validateRequest(createPostSchema), create);

// POST /api/posts/schedule - Schedule a post
router.post("/schedule", authenticateToken, schedule);

// GET /api/posts/my - Get current user's posts
router.get("/my", authenticateToken, getMyPosts);

// GET /api/posts/feed - Get posts from followed users
router.get("/feed", authenticateToken, getFeed);

// GET /api/posts/search - Search posts based on content
router.get("/search", authenticateToken, search);

// GET /api/posts/:post_id - Get a single post by ID
router.get("/:post_id", optionalAuth, getById);

// GET /api/posts/user/:user_id - Get posts by a specific user
router.get("/user/:user_id", optionalAuth, getUserPosts);

// DELETE /api/posts/:post_id - Delete a post
router.delete("/:post_id", authenticateToken, remove);

// PUT /api/posts/:post_id - Update a post
router.put("/:post_id", authenticateToken, update);

module.exports = router;
