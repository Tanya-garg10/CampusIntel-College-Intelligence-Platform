const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["placement", "academics", "clubs", "scholarships", "other"], required: true },
  urgency: { type: String, enum: ["low", "medium", "high"], default: "low" },
  tags: [{ type: String }],
  college: { type: String, required: true },
  branch: { type: String, required: true },
  trustScore: { type: Number, default: 0 },
  deadline: { type: Date },
  anonymous: { type: Boolean, default: false },
  comments: [commentSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
