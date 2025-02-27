const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploads");
const { verifyAdmin, verifyUser } = require("../middlewares/auth");
const chargesController = require("../controllers/charges-controller");

// Admin uploads a gym charges image
router.post("/", verifyUser, upload, chargesController.uploadCharges);

// Get all charges (publicly accessible)
router.get("/", chargesController.getAllCharges);

// Admin updates a specific charge (name & image)
router.put(
  "/:id",
  verifyUser,
  verifyAdmin,
  upload,
  chargesController.updateCharge
);

// Admin deletes a specific charge
router.delete("/:id", verifyUser, verifyAdmin, chargesController.deleteCharge);

module.exports = router;
