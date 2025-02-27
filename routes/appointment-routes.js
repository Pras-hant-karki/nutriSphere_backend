const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getPendingAppointments,
  getAcceptedAppointments,
  getRejectedAppointments,
} = require("../controllers/appointment-controller");
const { verifyAdmin, verifyUser } = require("../middlewares/auth");

// User requests an appointment
router.post("/", verifyUser, createAppointment);

// Admin gets all appointment requests
router.get("/", verifyUser, getAllAppointments);

// Admin accepts or rejects a request
router.put("/:id", verifyUser, verifyAdmin, updateAppointmentStatus);

// Admin gets all pending appointments
router.get("/pending", verifyUser, verifyAdmin, getPendingAppointments);

// Admin gets all accepted appointments
router.get("/accepted", verifyUser, verifyAdmin, getAcceptedAppointments);

// Admin gets all rejected appointments
router.get("/rejected", verifyUser, verifyAdmin, getRejectedAppointments);

module.exports = router;
