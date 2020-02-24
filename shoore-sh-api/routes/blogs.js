const express = require("express");
const BlogController = require("../controllers/blogs");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, BlogController.createBlog);
router.put("/:id", checkAuth, extractFile, BlogController.updateBlog);
router.get("", BlogController.getBlogs);
router.get("/:id", BlogController.getBlog);
router.delete("/:id", checkAuth, BlogController.deleteBlog);

module.exports = router;
