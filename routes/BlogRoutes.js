const express = require("express");
const BlogController = require("../controllers/BlogController");
const { requireAuth } = require("../utils/utils");

const router = express.Router();

router.post("/blog", BlogController.submitBlog);
router.delete("/blog", BlogController.deleteBlog);
router.get("/blog/:author/:id", BlogController.getSingleBlog);
router.get("/user/blogs", requireAuth, BlogController.getBlogs);
router.get("/blogs/:author", BlogController.getAuthorBlogs);
router.put("/blog", BlogController.updateBlog);

module.exports = router;
