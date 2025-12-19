const express = require("express");
const { getAnalyticsData } = require("../controllers/analyticsController");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const router = express.Router();
router.get("/", auth, role(["admin"]), getAnalyticsData);

module.exports = router;
