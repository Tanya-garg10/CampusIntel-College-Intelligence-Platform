const express = require("express");
const router = express.Router();
const User = require("../models/User");

// CREATE OR GET USER (Called after Firebase login/signup)
router.post("/", async (req, res) => {
  try {
    const { firebaseUid, name, collegeEmail, personalEmail, college, branch, role } = req.body;
    
    let user = await User.findOne({ firebaseUid });
    
    if (!user) {
      // Create new user in DB
      user = await User.create({
        firebaseUid, name, collegeEmail, personalEmail, college, branch, role
      });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET USER DETAILS
router.get("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
