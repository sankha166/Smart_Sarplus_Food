const path = require("path");
const FoodItem = require("../models/FoodItem");
const { notify } = require("../utils/sendNotification");

// ✅ Add Food Item
exports.addFoodItem = async (req, res) => {
  try {
    console.log("📥 Received Add Food request");
    console.log("🔹 Body data received:", req.body);
    console.log("🔹 Uploaded file info:", req.file);
    console.log("🔹 User from token:", req.user);

    // Build food object with safe conversions
    const foodData = {
      name: req.body.name,
      type: req.body.type || "",
      quantity: Number(req.body.quantity) || 0,
      freshnessStatus: req.body.freshnessStatus || "",
      availableUntil: req.body.availableUntil ? new Date(req.body.availableUntil) : null,
      location: req.body.location || "",
      safeForHours: req.body.safeForHours ? Number(req.body.safeForHours) : null,
      createdBy: req.user?.id || null
    };

    // ✅ Save proper image URL for frontend
    if (req.file) {
      foodData.imageUrl = `/uploads/${req.file.filename}`;
    } else {
      foodData.imageUrl = "/uploads/default.jpg"; // fallback
    }

    console.log("📦 Final data to be saved in DB:", foodData);

    const newFood = await FoodItem.create(foodData);

    console.log("✅ Food item successfully saved to DB:", newFood);

    // Notify system (optional)
    notify && notify(`New food listed: ${newFood.name} (${newFood.quantity} kg) at ${newFood.location}`);

    res.status(201).json(newFood);
  } catch (err) {
    console.error("❌ Error adding food item:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ Get Available Food Items
exports.getFoodItems = async (req, res) => {
  try {
    console.log("📡 Fetching available food items from DB...");

    // If food items don't set availableUntil reliably, fetch all; else, filter for future only.
    const items = await FoodItem.find(
      { $or: [ { availableUntil: { $exists: false } }, { availableUntil: { $gte: new Date() } } ] }
    ).sort({ createdAt: -1 });

    console.log(`✅ Found ${items.length} available food items`);
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching food items:", err);
    res.status(500).json({ message: err.message });
  }
};
