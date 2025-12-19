const mongoose = require("mongoose");

const eventLogSchema = new mongoose.Schema({
  eventName: String,
  eventDate: Date,
  loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  loggedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EventLog", eventLogSchema);
