const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  create,
  update,
  remove,
  getForPost,
} = require("../controllers/comments");

const router = express.Router();

/**
 * Comments routes
 * TODO: Implement comment routes when comment functionality is added
 */

// TODO: POST /api/comments - Create a comment on a post
router.post("/", authenticateToken, create);
// TODO: PUT /api/comments/:comment_id - Update a comment
router.put("/:comment_id", authenticateToken, update);
// TODO: DELETE /api/comments/:comment_id - Delete a comment
router.delete("/:comment_id", authenticateToken, remove);
// TODO: GET /api/comments/post/:post_id - Get comments for a post
router.get("/post/:post_id", authenticateToken, getForPost);

module.exports = router;
