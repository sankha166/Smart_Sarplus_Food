const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number,
  freshnessStatus: String,
  availableUntil: Date,
  location: String,
  safeForHours: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FoodItem", foodItemSchema);
