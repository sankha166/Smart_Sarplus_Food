const express = require("express");
const { register, login } = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware"); // Import middleware

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);

// ✅ Verify token route with user details
router.get("/verify", verifyToken, (req, res) => {
  res.json({
    user: {
      role: req.user.role,
      name: req.user.name,
      _id: req.user._id,                // Include fields you need
      profilePictureUrl: req.user.profilePictureUrl || null
    }
  });
});


module.exports = router;
