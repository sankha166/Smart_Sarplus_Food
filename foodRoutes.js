const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { addFoodItem, getFoodItems } = require("../controllers/foodController");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📂 Created uploads folder at", uploadsDir);
}

// Multer storage setup for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📂 Storing file in:", uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log(`🖼 Saving file as: ${uniqueName}`);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// POST /api/food - Add a new food item (restricted to donor/admin)
router.post(
  "/",
  auth,
  role(["donor", "admin"]),
  upload.single("image"),
  addFoodItem
);

// GET /api/food - Get all food items (public)
router.get("/", getFoodItems);

module.exports = router;
