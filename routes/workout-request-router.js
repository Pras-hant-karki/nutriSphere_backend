const express = require("express");
const {
  createRequest,

  getRequestById,
  updateRequest,
  deleteRequest,
  getUserRequests,
  getCompletedRequests,
  getPendingRequests,
  respondToRequest,
  getAllRequests
} = require("../controllers/workout-request-controller");
const { verifyUser, verifyAdmin } = require("../middlewares/auth");

const router = express.Router();

// User can create a workout request
router.post("/", verifyUser, createRequest);
router.get("/", verifyUser, getUserRequests);

// Admin can get all workout requests
router.get("/getAllRequests", verifyUser,verifyAdmin, getAllRequests);
router.get("/pending", verifyUser, getPendingRequests);

// ✅ Get only completed (responded) requests (User/Admin)
router.get("/completed", verifyUser, getCompletedRequests);

// User or Admin can get a specific request (Admin can see all, User can see only their own)
router.get("/:id", verifyUser, getRequestById);
router.put("/:id", verifyUser, updateRequest);
router.delete("/:id", verifyUser, deleteRequest);

// Admin can respond to a workout request
router.put("/:id/respond", verifyUser,verifyAdmin, respondToRequest);

module.exports = router;
