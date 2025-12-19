const { getAnalytics } = require("../utils/analyticsTracker");

exports.getAnalyticsData = async (req, res) => {
  try {
    const data = await getAnalytics();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
