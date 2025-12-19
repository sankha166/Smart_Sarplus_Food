const jwt = require("jsonwebtoken");
const User = require("../models/User"); // import your user model

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token after "Bearer"

  if (!token) {
    return res.status(401).json({ valid: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB without password field
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ valid: false, message: "User not found" });
    }

    req.user = user; // Attach full user document to req.user
    next();
  } catch (err) {
    return res.status(401).json({ valid: false, message: "Invalid token" });
  }
};
