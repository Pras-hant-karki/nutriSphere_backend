const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploads");
const userController = require("../controllers/user-controller");
const { verifyUser, verifyAdmin } = require("../middlewares/auth");

// User registration
router.post("/register", userController.registerUser);

// User login
router.post("/login", userController.loginUser);

// Get user profile
router.get("/", verifyUser, userController.getUserProfile);


router.get("/admin/dashboard", verifyUser, verifyAdmin, (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// Update user profile
router.put("/edit-profile", verifyUser, userController.updateUserProfile);

// Upload image
router.post("/uploadImage", verifyUser, upload, userController.uploadImage);

// Get all exchange requests for a user
router.get(
  "/:user_id/exchange-requests",
  userController.getAllExchangeRequests
);

module.exports = router;
