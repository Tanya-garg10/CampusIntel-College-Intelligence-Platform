const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  collegeEmail: { type: String },
  personalEmail: { type: String },
  college: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: Number },
  role: { type: String, enum: ["admin", "moderator", "senior", "junior"], required: true },
  trustScore: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  badges: [{ type: String }],
  skills: [{ type: String }],
  links: {
    linkedin: String,
    github: String
  },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
