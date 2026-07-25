const express = require("express");
const { authMiddleware } = require("../../middleware/auth.middleware");
const {
    getAllBlogs,
    getBlogsByUserId,
    createBlog,
    getBlogBySlug,
    getBlogById,
    updateBlog,
    deleteBlog,
    publishBlog,
    unPublishBlog,
    likeBlog,
    unlikeBlog,
} = require("../../controllers/v1/blog.controller");
const multerMiddleware = require("../../middleware/multer.middleware");
const router = express.Router();

router.get("/", getAllBlogs);

router.get("/user", authMiddleware, getBlogsByUserId);

router.post("/", authMiddleware, multerMiddleware.single('image'), createBlog);

router.get("/id/:id", authMiddleware, getBlogById);

router.get("/:slug", getBlogBySlug);

router.put("/:id", authMiddleware, multerMiddleware.single('image'), updateBlog);

router.delete("/:id", authMiddleware, deleteBlog);

router.post("/publish", authMiddleware, publishBlog);

router.post("/unpublish", authMiddleware, unPublishBlog);

router.patch("/like/:id", authMiddleware, likeBlog);

router.patch("/unlike/:id", authMiddleware, unlikeBlog);

module.exports = router;
