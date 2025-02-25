const  Appointment  = require('../models/Appointment');
const  User=require("../models/User")

// Create an appointment request
exports.createAppointment = async (req, res) => {
    try {
        const { requestedDate } = req.body;
        const userId = req.user.id; // Assuming authentication middleware adds user info

        const appointment = await Appointment.create({ userId, requestedDate });

        res.status(201).json({ success: true, message: "Appointment request submitted.", appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all appointments (Admin Only)
exports.getAllAppointments = async (req, res) => {
    try {
        // Fetch all appointments
        const appointments = await Appointment.findAll();

        // Manually fetch user for each appointment
        const appointmentsWithUser = [];
        for (let appointment of appointments) {
            const user = await User.findByPk(appointment.userId); // Find user by userId
            appointmentsWithUser.push({
                ...appointment.toJSON(),
                user: user ? user.toJSON() : null // Attach user to appointment data
            });
        }

        res.status(200).json({ success: true, appointments: appointmentsWithUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

