const FoodItem = require("../models/FoodItem");

exports.getAnalytics = async () => {
  const totalItems = await FoodItem.countDocuments();
  const totalQuantity = await FoodItem.aggregate([
    { $group: { _id: null, qty: { $sum: "$quantity" } } }
  ]);
  return {
    totalItems,
    totalQuantity: totalQuantity[0]?.qty || 0,
    foodSavedKg: totalQuantity[0]?.qty || 0,
    carbonSavedKg: (totalQuantity[0]?.qty || 0) * 2.5
  };
};
