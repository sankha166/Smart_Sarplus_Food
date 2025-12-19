const express = require("express");
const { logEvent, getEvents } = require("../controllers/eventController");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const router = express.Router();
router.post("/", auth, role(["donor", "admin"]), logEvent);
router.get("/", auth, getEvents);

module.exports = router;
