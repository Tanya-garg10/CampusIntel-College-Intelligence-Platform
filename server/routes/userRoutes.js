const express = require("express");
const router = express.Router();
const User = require("../models/User");

// CREATE OR GET USER (Called after login/signup)
router.post("/", async (req, res) => {
  try {
    const { userId, name, collegeEmail, personalEmail, college, branch, role } = req.body;

    let user = await User.findOne({ userId });

    if (!user) {
      // Create new user in DB
      user = await User.create({
        userId, name, collegeEmail, personalEmail, college, branch, role
      });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET USER DETAILS
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
