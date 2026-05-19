const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// CREATE POST
router.post("/", async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET POSTS (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { college, branch, category } = req.query;
    let query = {};
    if (college) query.college = college;
    if (branch) query.branch = branch;
    if (category) query.category = category;

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPVOTE POST
router.post("/:id/upvote", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id, 
      { $inc: { trustScore: 1 } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
