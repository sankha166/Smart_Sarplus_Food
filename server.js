const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const cron = require("node-cron");
const path = require("path");
const FoodItem = require("./models/FoodItem");
const { init } = require("./utils/sendNotification");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

// Body parser middleware
app.use(express.json());

// Rate limiting: max 100 requests per minute per IP
app.use(
  rateLimit({
    windowMs: 60 * 1000, 
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Serve static files - uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

// Scheduled job: Delete expired food items every hour on the hour
cron.schedule("0 * * * *", async () => {
  try {
    const result = await FoodItem.deleteMany({ availableUntil: { $lt: new Date() } });
    console.log(`🗑️ Removed expired food items: ${result.deletedCount}`);
  } catch (err) {
    console.error("❌ Error removing expired food items:", err);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Initialize any socket or notification utilities
init && init(server);
