const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ["alert", "reminder", "message", "system"], required: true },
  message: { type: String, required: true },
  readStatus: { type: Boolean, default: false },
  priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
