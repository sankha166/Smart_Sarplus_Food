const EventLog = require("../models/EventLog");

exports.logEvent = async (req, res) => {
  try {
    const event = await EventLog.create({ ...req.body, loggedBy: req.user.id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await EventLog.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
