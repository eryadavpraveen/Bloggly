const express = require("express");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { getAllCommentsForBlog, addCommentToBlog, deleteComment, updateComment } = require("../../controllers/v1/comment.controller");
const router = express.Router();

router.get("/:blogId", getAllCommentsForBlog);

router.post("/:blogId", authMiddleware, addCommentToBlog);

router.delete("/:commentId", authMiddleware, deleteComment);

router.put("/:commentId", authMiddleware, updateComment);

module.exports = router;